import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath || typeof localFilePath !== "string") {
      throw new Error("Invalid localFilePath");
    }

    // Uploading file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File has been uploaded to Cloudinary
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // Delete the file if it still exists locally
    }
    return null;
  }
};

export { uploadOnCloudinary }; // Exporting the function properly
