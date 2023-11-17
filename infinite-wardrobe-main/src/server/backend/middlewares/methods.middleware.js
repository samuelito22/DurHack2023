const allowedMethods = [
	'OPTIONS',
	'HEAD',
	'CONNECT',
	'GET',
	'POST',
	'PUT',
	'DELETE',
	'PATCH',
];

const methodMiddleware = (req, res, next) => {
	//Exclude TRACE and TRACK methods to avoid XST attacks.	

	if (!allowedMethods.includes(req.method)) {
		res.status(405).send(`${req.method} not allowed.`);
	}
  
	next();
};

export default methodMiddleware;
