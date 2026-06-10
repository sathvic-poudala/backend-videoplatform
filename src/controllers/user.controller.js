import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshToken = async(userId) => {
    const user = await User.findById(userId)
    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken

    await user.save({validationBeforeSave: false})

    return {
        accessToken,
        refreshToken
    }
}

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

    const userExists = await User.findOne({
        $or:[{userName},{email}]
    }) 

    if(userExists) {
        throw new ApiError(409,"user or email already exists")
    }
    
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    

    if(!avatarLocalPath) {
        throw new ApiError(400,"avatar is required1");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(500,"avatar is required");
    }

    const user = await User.create({
        fullName,
        userName: userName.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password,
        email,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refershToken"
    )
    if(!createdUser) {
        throw new ApiError(500,"smth went wrong while regestering user")
    }

    return res.status(201).json(
        new ApiResponse(200,"user created successfully", createdUser)
    )
})

const loginUser = asyncHandler( async(req,res) => {
    
    //first get details username and password 
    //check credentials
    //generate acces and refresh token
    //send using secoure cookies

    const {userName,email,password} = req.body;

    if(!userName && !email) {
        throw new ApiErrorError(400,"all feilds are required");
    }

    if(email && !email.includes("@")) {
        throw new ApiError(400,"invalid email")
    }

    const user = await User.findOne({
        $or: [{userName},{email}]
    })

    if(!user) {
        throw new ApiError(400,"user not present plz register first")
    }

    const flagForPasswordValidaton = await user.isPasswordMatch(password)

    if(!flagForPasswordValidaton) {
        throw new ApiError(400,"wrong password")
    }

    const {refreshToken,accessToken} = await generateAccessAndRefreshToken(user._id)

    user.refershToken = refreshToken;

   const loggedInUser = user.toObject();

    delete loggedInUser.password;
    delete loggedInUser.refreshToken;

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }

    return res
    .status(201)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            201,
            "user logged in sucessfully",
            {
                refreshToken,
                accessToken,
                user: loggedInUser
            }
        )
    )

})

const logoutUser = asyncHandler( async(req,res) => {
    /** destroy cookies and remove refersh token from user in mongodb database */
    const userId = req.user?._id

    User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refershToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json( new ApiResponse(200,"user logged out"))

})


export { 
    registerUser,
    loginUser,
    logoutUser
 }