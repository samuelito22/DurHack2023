import jsonwebtoken from 'jsonwebtoken';

const middleware = (req, res, next) => {
	const token = req.cookies.authorization;
	if (!token) {
		res.status(401).json({ message: 'Unauthorized' });
		return;
	}
	try {
		const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
		if(!token) return res.status(401).json({ message: 'Unauthorized' });
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: 'Unauthorized' });
	}
};

export default middleware;
