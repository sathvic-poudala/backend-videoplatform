import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateCoverImage, updateAvatar, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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
    registerUser
)//tested
router.route("/login").post(loginUser)//tested

//secure routes
router.route("/logout").post(verifyJWT,logoutUser)//tested
router.route("/refresh-token").post(refreshAccessToken)//tested
router.route("/change-password").post(verifyJWT,changeCurrentPassword)//tested
router.route("/getCurrentUser").post(verifyJWT,getCurrentUser)//tested
router.route("/update-account").patch(verifyJWT,updateAccountDetails)//tested
router.route("/avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateAvatar
)//tested
router.route("/cover-image").patch(
    verifyJWT,
    upload.single("coverImage"),
    updateCoverImage
)//tested
router.route("/channel/:username").get(verifyJWT, getUserChannelProfile)
router.route("/watch-history").get(verifyJWT, getWatchHistory)

export default router