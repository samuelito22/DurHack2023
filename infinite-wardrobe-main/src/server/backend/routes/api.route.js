import { Router } from 'express';

import AuthMiddleware from '../middlewares/auth.middleware.js';

import AuthRouter from './auth.route.js';
import ClothingRouter from './clothing.route.js';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/clothing', AuthMiddleware, ClothingRouter);

router.get('/teapot', (req, res, next) => res.status(418).json({ message: 'I\'m a teapot' }));

export default router;
