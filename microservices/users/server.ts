import express from 'express';
import exampleRoutes from './routes/exampleRoutes';

const app = express();

app.use(express.json());
app.use('/api/users', exampleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Microservice 'users' running on port ${PORT}`));