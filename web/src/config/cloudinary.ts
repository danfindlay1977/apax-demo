import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "./src/config/.config.env" });

const configureCloudinary = (): void => {
  const cloudName = process.env.CLOUDINARY_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    console.log({ cloudName, apiKey, apiSecret });

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary config is missing. Set CLOUDINARY_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  cloudinary.v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
};

export default configureCloudinary;