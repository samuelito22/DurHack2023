import jsonwebtoken from 'jsonwebtoken';

import { UserModel } from '../schemas/user.schema.js';
import getError from '../lib/error.js';

export const getCurrentUser = async (req, res, next) => {
	const user = await UserModel.findById(req.user.id, { password: 0, __v: 0 });

	if(!user) return res.status(401).json({ message: 'Unauthorized' });

	res.status(200).json({ 
		message: 'User retrieved Successfully',
		user: user
	});
};

export const createUser = async (req, res, next) => {

	const user = new UserModel({
		username: req.body.username,
		password: req.body.password
	});

	user.save()
		.then(dat => {
			return res.status(201).json({ message: 'User created successfully', user: dat });
		})
		.catch(err => {
			return res.status(500).json({ error: getError(err) });
		});

};

export const login = async (req, res, next) => {
	const user = await UserModel.findOne({ username: req.body.username });
	try {
		if(!(
			req.body.password 
			&& user
			&& await user.authenticateUser(req.body.password)
		)) {
			return res.status(401).json({message: 'Incorrect username or password'});
		}

		const token = jsonwebtoken.sign(
			{ id: user._id },
			process.env.JWT_SECRET,
			{ expiresIn: '1d' }
		);

		res.cookie('authorization', token, {
			expire: new Date() + 86400,
			httpOnly: false,
			secure: false
		});

		res.status(200).json({
			message: 'Login successful',
			//authentication: token,
			user: {
				id: user._id,
				username: user.username,
			}
		});
	} catch(err) {
		return res.status(500).json({ error: getError(err) });
	}
};

export const logout = async (req, res, next) => {
	res.clearCookie('authorization');
	res.status(200).json({ message: 'Logged out' });
};
