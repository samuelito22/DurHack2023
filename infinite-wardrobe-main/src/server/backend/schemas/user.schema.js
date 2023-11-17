import { Schema, model } from 'mongoose';

import { hashPassword, comparePassword } from '../lib/crypto.js';

export const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		require: 'Name is required',
		unique: true
	},
	password: {
		type: String,
		required: true
	}
}, {collection: 'users'}, { timestamps: true });

UserSchema.pre('save', async function(next) {
	let user = this;

	if (!user.isModified('password')) return next();

	user.password = await hashPassword(user.password);
	next();
});

UserSchema.methods = {
	authenticateUser: async function(plaintextPassword) {    //basic jw authentication
		return await comparePassword(plaintextPassword, this.password);
	}
};

export const UserModel = model('User', UserSchema);
