import express, { Application } from 'express';
import { UserController } from './UserController';

const app: Application = express();

app.use(express.json());

app.post('/users', UserController.createUser);

// other routes...

export default app;