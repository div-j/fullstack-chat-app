import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"
dotenv.config()


// Configuration
cloudinary.config({ 
        cloud_name: process.env.CLOUDNARY_NAME, 
        api_key: process.env.CLOUDNARY_API, 
        api_secret: process.env.CLOUDNARY_SECRETE // Click 'View API Keys' above to copy your API secret
    });
    
export default cloudinary
