import app from './infrastructure/web/Server';
    import mongoose from 'mongoose';
    import { config } from './infrastructure/config';
    
    const startApplication = async () => {
        try {
            await mongoose.connect(config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log('Connected to MongoDB');
    
            app.listen(config.port, () => {
                console.log(`Server running on http://localhost:${config.port}`);
            });
        } catch (error) {
            console.error('Failed to connect to MongoDB', error);
            process.exit(1); // Exit with failure
        }
    };
    
    startApplication();