import { Router } from 'express';
import { getExample } from '../controllers/ExampleController';

const router = Router();

router.get('/orders', getExample);

export default router;