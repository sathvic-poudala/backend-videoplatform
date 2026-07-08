import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateCoverImage, updateAvatar, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateBodyFields } from "../middlewares/validate.middleware.js";

const router = Router()

// POST /register - Register a new user with avatar and cover image
router.route("/register").post(
    upload.fields(
        [{
            name: "avatar",
            maxCount: 1
        },
        {
             name: "coverImage",
            maxCount: 1
        }]
    ),
    validateBodyFields(["userName", "email", "fullName", "password"]),
    registerUser
)

// POST /login - Login user with email and password
router.route("/login").post(validateBodyFields(["email", "password"]), loginUser)

// Secure routes below
// POST /logout - Logout authenticated user
router.route("/logout").post(verifyJWT,logoutUser)

// POST /refresh-token - Refresh access token using refresh token
router.route("/refresh-token").post(refreshAccessToken)

// POST /change-password - Change password for authenticated user
router.route("/change-password").post(verifyJWT, validateBodyFields(["oldPassword", "newPassword"]), changeCurrentPassword)

// GET /getCurrentUser - Get current authenticated user details
router.route("/getCurrentUser").get(verifyJWT,getCurrentUser)

// PATCH /update-account - Update account details (email, fullName)
router.route("/update-account").patch(verifyJWT, validateBodyFields(["email", "fullName"]), updateAccountDetails)

// PATCH /avatar - Update user avatar image
router.route("/avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateAvatar
)

// PATCH /cover-image - Update user cover image
router.route("/cover-image").patch(
    verifyJWT,
    upload.single("coverImage"),
    updateCoverImage
)

// GET /channel/:username - Get user channel profile by username
router.route("/channel/:username").get(verifyJWT, getUserChannelProfile)

// GET /watch-history - Get user's video watch history
router.route("/watch-history").get(verifyJWT, getWatchHistory)

export default router
