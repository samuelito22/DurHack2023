import { Router } from 'express';


import AuthMiddleware from '../middlewares/auth.middleware.js';
import * as AuthController from '../controllers/auth.controller.js';

const router = Router();

router.get('/', AuthMiddleware, AuthController.getCurrentUser);
router.post('/', AuthMiddleware, AuthController.createUser);
router.post('/logout', AuthController.logout);
router.post('/login', AuthController.login);

export default router;
