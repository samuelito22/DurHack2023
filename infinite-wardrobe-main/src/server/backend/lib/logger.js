import winston from 'winston';

const { colorize, combine, json, timestamp, printf } = winston.format;

const LOGGER_MAX_FILE_SIZE = 10000000;
winston.level = 'http';
winston.format = combine(
	timestamp(),
	json()
);
winston.add(new winston.transports.File({ filename: './logs/error.log', level: 'error', maxsize: LOGGER_MAX_FILE_SIZE}));
winston.add(new winston.transports.File({ filename: './logs/latest.log', level: 'http', maxsize: LOGGER_MAX_FILE_SIZE}));


if (process.env.NODE_ENV !== 'production') {
	winston.level = 'debug';
	winston.add(new winston.transports.Console({
		format: combine(
			colorize(),
			timestamp({
				format: 'HH:mm:ss'
			}),
			printf((info) => {
				return `[${info.timestamp}] [${info.level}]: ${info.message}`;
			})
		)
	}));
}

export default winston;
