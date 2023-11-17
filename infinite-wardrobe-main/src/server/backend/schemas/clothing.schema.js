import { Schema, model } from 'mongoose';

export const ClothingSchema = Schema({
	ownerId: {
		type: Schema.ObjectId,
		ref: 'users'
	},
	imageString: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	colour: {
		type: String,
		required: true
	}
	
}, {collection: 'clothing'}, {timestamps: true});

export const ClothingModel = model('Clothing', ClothingSchema);
