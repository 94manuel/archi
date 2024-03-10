import { Router } from 'express';
import * as UserController from '../../interfaces/controllers/UserController';

const router = Router();

router.post('/users', UserController.createUser);

export default router;