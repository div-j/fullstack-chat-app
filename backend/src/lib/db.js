import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


let dbUrl = process.env.MONGO_URI;


export const connectDb = async () => { 
    try {
        let con = await mongoose.connect(`${dbUrl}`);        
        console.log('MongoDB connected', con.connection.host);
    } catch (error) {
        console.log('Error connecting to MongoDB:', error.message);
    }
   
};