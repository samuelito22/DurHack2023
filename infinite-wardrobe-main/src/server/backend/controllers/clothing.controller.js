import fs from 'fs';
import sharp from 'sharp';
import { join } from 'path';

import { ClothingModel } from '../schemas/clothing.schema.js';
import { classifyClothing, saveB64Image, imageToB64, getImageColour } from '../lib/imagetools.js';
import getError from '../lib/error.js';
import logger from '../lib/logger.js';

sharp.cache({ files : 0 }); // Disable sharp cache to prevent it from hanging on to files

// GET /
export const getWardrobe = async (req, res, next) => {
	try {
		const clothing = await ClothingModel.find({ownerId: req.user.id});

		if(clothing.length == 0) {
			return res.status(204).json({ message: 'No clothing found' });
		} else {
			return res.status(200).json({
				clothing
			});
		}
	} catch (err) {
		return res.status(500).json({ error: getError(err) });
	}
};

// GET /:id
export const getItem = async (req, res, next) => {
	return res.status(501).json({ message: 'Not implemented' });
};

// POST /
export const createItem = async (req, res, next) => {
	// Receives image as base64 encoded string
	const encodedImage = req.body.image;

	if(!encodedImage) return res.status(400).json({ message: 'No image provided' });

	if (!fs.existsSync(process.env.TMP_DIR)){
		fs.mkdir(process.env.TMP_DIR, { recursive: true }, (err, path) => {
			if(err) logger.error(err);

			logger.info('Directory created')
		});
	}

	let path;
	let classification;

	try {
		path = await saveB64Image(encodedImage, process.env.TMP_DIR);
		if(!path) return res.status(500).json({ message: 'Error saving image' });

		classification = await classifyClothing(encodedImage);

		if(classification.predictions.length == 0) return res.status(500).json({ message: 'Error classifying image' });
		
		for(let i = 0; i < classification.predictions.length; i++) {
			const prediction = classification.predictions[i];
			const croppedPath = join(
				process.env.TMP_DIR, 
				`${i}--${prediction.class}-${req.user.id}-${Date.now()}.jpg`
			);

			const cropLeft = Math.floor(prediction.x - (prediction.width/2));
			const cropWidth = Math.floor(Math.max(2, Math.min(prediction.width, classification.image.width - (cropLeft + 5))));
			const cropTop = Math.floor(prediction.y - (prediction.height/2));
			const cropHeight = Math.floor(Math.max(2, Math.min(prediction.height, classification.image.height - (cropTop + 5))));

			await sharp(path)
				.rotate()
				.extract({
					left: cropLeft,
					top: cropTop,
					width: cropWidth,
					height: cropHeight
				}).toFile(croppedPath);

			classification.predictions[i].croppedPath = croppedPath;
			classification.predictions[i].croppedImage = `data:image/jpeg;base64,${await imageToB64(croppedPath)}`;

			const colours = (await getImageColour(croppedPath)).data;
			
			classification.predictions[i].colour = colours[Math.max(colours.length-2, 0)].simple_color;
		}

		// TODO: Send cropped images to colour detection API

		classification.predictions.forEach(prediction => {
			const clothesItem = new ClothingModel({
				ownerId: req.user.id,
				imageString: prediction.croppedImage,
				category: prediction.class,
				colour: prediction.colour,
			});

			clothesItem.save();
		});

		return res.status(200).json(classification);
	} finally {
		if(process.env.NODE_ENV == 'production') {
			if(path) fs.unlink(path, err => {
				if(err) {
					logger.error(err);
				} else {
					logger.info(`Deleted ${path}`);
				}
			});

			if(classification && classification.predictions) classification.predictions.forEach(prediction => {
				if(prediction.croppedPath) fs.unlink(prediction.croppedPath, err => {
					if(err) {
						logger.error(err);
					} else {
						logger.info(`Deleted ${prediction.croppedPath}`);
					}
				});
			});
		}
	}
};

// PUT /:id
export const updateItem = async (req, res, next) => {
	return res.status(501).json({ message: 'Not implemented' });
};

// DELETE /:id
export const deleteItem = async (req, res, next) => {
	return res.status(501).json({ message: 'Not implemented' });
};
