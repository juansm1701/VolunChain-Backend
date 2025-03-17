import { Router } from 'express';
import AuthController from '../controllers/Auth.controller';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/login', AuthController.login);
router.get('/protected', authMiddleware, AuthController.protectedRoute);

export default router;