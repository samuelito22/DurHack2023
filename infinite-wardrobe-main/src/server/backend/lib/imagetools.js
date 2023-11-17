import axios from 'axios';
import fs from 'fs/promises';
import { resolve, join } from 'path';

import logger from './logger.js';

export const classifyClothing = async image => {
	// Uses roboflow to classify a base64 encoded image

	try {
		const res = await axios({
			method: 'POST',
			url: process.env.ROBOFLOW_MODEL_API_URL,
			params: {
				api_key: process.env.ROBOFLOW_API_KEY
			},
			data: image,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
		return res.data;
	} catch (err) {
		logger.error(err);
	}
};

export const saveB64Image = async (base64, folder) => {
	const matches = base64.match(/^data:image\/([A-Za-z+]+);base64,(.+)$/);

	if (!(matches && matches.length == 3)) {
		logger.error('Invalid base64 string');
		return;
	}

	const imageData = Buffer.from(matches[2], 'base64');
	const path = join(folder, `${Date.now()}.${matches[1]}`);

	try {
		await fs.writeFile(path, imageData);
	} catch (err) {
		logger.error(err);
		return;
	}

	return path;
};

export const imageToB64 = async path => {
	const data = await fs.readFile(path);
	return Buffer.from(data).toString('base64');
};

export const getImageColour = async path => {
	try {
	

		const headers = {
			'Content-Type': 'application/json'
		}

		const body = {
			'image_path': resolve(path)
		}

		const res = await axios.post(process.env.LOCAL_COLOUR_API_URL, body, {
			headers: headers
		});

		return res;
					
	} catch (err) {
		logger.error(err);
	}
};