import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async(req,res) => {
    //get user details from front end
    //check if all the required feild are present
    //check if user already exits
    //upload pic to cloudinary and get url
    //create user object
    //remove password and refresh token feild from response
    //check for user creation
    //return

    const {userName,email,fullName,password} = req.body;

    if (
        [userName,email,fullName,password].some((feild) => feild?.trim() === "")
    ) {
        throw new ApiError(400,"all feilds are required")
    }

    if(!email.includes('@')) {
        throw new ApiError(400,"email not valid")
    }

    const userExists = User.findOne({
        $or:[{userName},{email}]
    }) 

    if(userExists) {
        throw new ApiError(409,"user or email already exists")
    }
    
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400,"avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400,"avatar is required");
    }

    const user = User.create({
        fullName,
        userName: userName.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password,
        email,
    })

    const createdUser = User.findById(user._id).select(
        "-password -refershToken"
    )

    if(!userExists) {
        throw new ApiError(500,"smth went wrong while regestering user")
    }

    return res.status(201).json(
        new ApiResponse(200,"user created successfully", createdUser)
    )
})

export { registerUser }