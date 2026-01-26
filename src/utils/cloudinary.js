import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    })
    //file has been uploaded
    console.log("file uploade on cloudinary successfully", response.url)
    fs.unlinkSync(localFilePath) // remove the locally saved temporary file after successful upload
    return response
  } catch (error) {
    fs.unlinkSync(localFilePath) // remove the locally saved temporary
    // file as the upload operation got failed
    return null
  }
}

// Delete file
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error("Cloudinary delete error:", error.message)
  }
}

// Extract public_id from URL
const getPublicIdFromUrl = (url) => {
  if (!url) return null

  const parts = url.split("/")
  const uploadIndex = parts.indexOf("upload")
  const pathAfterUpload = parts.slice(uploadIndex + 1).join("/")
  return pathAfterUpload.split(".")[0]
}

// // Upload an image
//  const uploadResult = await cloudinary.uploader
//    .upload(
//        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//            public_id: 'shoes',
//        }
//    )
//    .catch((error) => {
//        console.log(error);
//    });

// console.log(uploadResult);

export { uploadOnCloudinary, deleteFromCloudinary, getPublicIdFromUrl }
