import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, updateComment, deleteComment, getVideoComments } from "../controllers/comment.controller.js";
import { validateObjectId } from "../middlewares/validate.middleware.js";

const router = Router()

router.use(verifyJWT)

// POST /:videoId - Add a comment to a video
// GET /:videoId - Get all comments for a video
router.route("/:videoId")
    .post(validateObjectId("videoId"), addComment)
    .get(validateObjectId("videoId"), getVideoComments);

// PATCH /comment/:commentId - Update a comment
// DELETE /comment/:commentId - Delete a comment
router.route("/comment/:commentId")
    .patch(validateObjectId("commentId"), updateComment)
    .delete(validateObjectId("commentId"), deleteComment);

export default router
