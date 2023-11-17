import morgan from 'morgan';
import logger from '../lib/logger.js';

const stream = {
	write: message => logger.http(message)
};

//const skip = () => process.env.NODE_ENV == 'production';

const middleware = morgan(
	':remote-addr :method :url :status :res[content-length] - :response-time ms',
	{ stream }
);

export default middleware;
