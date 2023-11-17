import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import { join, dirname} from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';


import ApiRouter from './routes/api.route.js';

import LoggerMiddleware from './middlewares/logger.middleware.js';
import MethodMiddleware from './middlewares/methods.middleware.js';

const app = express();
const __dirname = fileURLToPath(dirname(import.meta.url));

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());

app.use(cors());

app.use(LoggerMiddleware);
app.use(MethodMiddleware);

app.use((req, res, next) => {
	if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path) || req.path.startsWith('/api')) {
		next();
	} else {
		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
		res.header('Expires', '-1');
		res.header('Pragma', 'no-cache');
		res.sendFile(join(__dirname, '../../client/build', 'index.html'));
	}
});

app.use(express.static(join(__dirname, '../../client/build')));
app.use('/api/', ApiRouter);


app.use((req, res, next) => {
	res.setHeader('X-Powered-By', 'Consumerism and Capitalism');
	res.setHeader('X-Author', 'Fast Fashion');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
	);
	res.setHeader(
	 	'Access-Control-Allow-Methods',
	 	'GET, POST, PUT, DELETE, PATCH, OPTIONS'
	);
	next();
});

export default app;
