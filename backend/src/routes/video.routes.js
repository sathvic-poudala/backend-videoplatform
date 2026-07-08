import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getAllVideos, publishAVideo, getVideoById, deleteVideo, updateVideo, togglePublishStatus } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validateObjectId, validateBodyFields } from "../middlewares/validate.middleware.js";

const router = Router()

router.use(verifyJWT)

// GET / - Get all videos
// POST / - Publish a new video with videoFile and thumbnail
router.route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        validateBodyFields(["title", "description"]),
        publishAVideo
    );

// GET /:videoId - Get video details by ID
// DELETE /:videoId - Delete a video
// PATCH /:videoId - Update video details with thumbnail
router
    .route("/:videoId")
    .get(validateObjectId("videoId"), getVideoById)
    .delete(validateObjectId("videoId"), deleteVideo)
    .patch(validateObjectId("videoId"), upload.single("thumbnail"), updateVideo);

// PATCH /toggle/publish/:videoId - Toggle publish status of a video
router.route("/toggle/publish/:videoId").patch(validateObjectId("videoId"), togglePublishStatus);

export default router;
