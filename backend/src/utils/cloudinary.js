import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        
        const response = await cloudinary.uploader.upload(
            localFilePath, {
              resource_type: 'auto'
           }
        )

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        return response;
        
    } catch (error) {
        console.log("Cloudinary upload error:", error);
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}

const deleteFromCloudinary = async (publicURL) => {
    try {
        if(!publicURL) return null;


    
        const urlParts = publicURL.split("/");
        const fileName = urlParts[urlParts.length - 1]; 
        const publicId = fileName.split(".")[0];
    
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
        
    } catch (error) {
        console.log("cloudinary deletion error: ", error)
        return null;
    }
}


export { 
        uploadOnCloudinary,
        deleteFromCloudinary
    }