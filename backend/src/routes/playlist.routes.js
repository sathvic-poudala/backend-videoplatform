import { Router } from "express";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validateObjectId, validateBodyFields } from "../middlewares/validate.middleware.js";

const router = Router()

router.use(verifyJWT)

router.route("/").post(validateBodyFields(["name"]), createPlaylist)

router.route("/user/:userId").get(validateObjectId("userId"), getUserPlaylists)

router.route("/:playlistId")
.get(validateObjectId("playlistId"), getPlaylistById)
.delete(validateObjectId("playlistId"), deletePlaylist)
.patch(validateObjectId("playlistId"), validateBodyFields(["name", "description"]), updatePlaylist)

router.route("/add/:videoId/:playlistId").patch(validateObjectId("videoId"), validateObjectId("playlistId"), addVideoToPlaylist)

router.route("/remove/:videoId/:playlistId").patch(validateObjectId("videoId"), validateObjectId("playlistId"), removeVideoFromPlaylist)

export default router;