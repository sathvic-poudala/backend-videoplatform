import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment } from "../controllers/comment.controller.js";

const router = Router()

app.use(verifyJWT)

//routes
router.route("/:videoId").post(addComment).get

export default router