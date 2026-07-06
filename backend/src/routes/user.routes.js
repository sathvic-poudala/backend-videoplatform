import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateCoverImage, updateAvatar, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateBodyFields } from "../middlewares/validate.middleware.js";

const router = Router()

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
router.route("/login").post(validateBodyFields(["email", "password"]), loginUser)

//secure routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, validateBodyFields(["oldPassword", "newPassword"]), changeCurrentPassword)
router.route("/getCurrentUser").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT, validateBodyFields(["email", "fullName"]), updateAccountDetails)
router.route("/avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateAvatar
)
router.route("/cover-image").patch(
    verifyJWT,
    upload.single("coverImage"),
    updateCoverImage
)
router.route("/channel/:username").get(verifyJWT, getUserChannelProfile)
router.route("/watch-history").get(verifyJWT, getWatchHistory)

export default router