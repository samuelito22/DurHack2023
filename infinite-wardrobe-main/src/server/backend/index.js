import mongoose from 'mongoose';

import logger from './lib/logger.js';

import './lib/dotenv.js'; // Allows for .env config to be accessed despite import hoisting.

import server from './app.js';

const PORT = process.env.port??80;

mongoose.connect(
	process.env.MONGODB_CONN_STR,
	{
		autoIndex: true
	}
).then(() => {
	
	logger.info('Connected to MongoDB');

	server.listen(PORT, () => {
		logger.info(`Server listening on port ${PORT}`);
	});

}).catch(err => {
	logger.error(err.message);
	process.exit(1);
});

const handleExit = signal => {
	logger.debug(`Received ${signal}, exiting...`);
	mongoose.disconnect();
	process.exit();
};

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => process.on(signal, handleExit));
