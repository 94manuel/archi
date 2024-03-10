import { Router } from 'express';
import { getExample } from '../controllers/ExampleController';

const router = Router();

router.get('/users', getExample);

export default router;