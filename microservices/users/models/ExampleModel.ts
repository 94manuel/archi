import { Schema, model } from 'mongoose';

const ExampleSchema = new Schema({
    name: String,
    // Define other fields
});

export const ExampleModel = model('Example', ExampleSchema);