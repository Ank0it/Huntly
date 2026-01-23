import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
   //get user details from frontend
   //validate - not empty 
   //check if user already exists : username, email
   //check for images, check for avatar
   //upload image to cloudinary, get the url
   //create user object - create entry in db
   //remove password and refresh token from field from response
   //check for user creation 
   //return response to frontend
   
   //get user details from frontend
   const {fullName,email,username,password} = req.body
   console.log("email:",email);
   //validate - not empty
   if(
    [fullName,email,username,password].some((value) => 
      value?.trim() === "")
    )
    {
        throw new ApiError(400,"All fields are required")
    }
     //check if user already exists : username, email
    const userExisted = await User.findOne({
        $or: [{ email },{ username }]
    })
    
    if(userExisted){
        throw new ApiError(409,"User with email or username already exists")
    }
     
    //check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar image is required")
    }

    //upload images to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

     if(!avatar){
        throw new ApiError(500,"Unable to upload avatar image, please try again later")
     }
    
     //create user object
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    }) 
    
    //remove password and refresh token from field from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
  
    //check for user creation
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    //return response to frontend
    return res.status(201).json(
        new ApiResponse(201, createdUser,"User registered successfully")
    )

})

export { 
    registerUser
 }
