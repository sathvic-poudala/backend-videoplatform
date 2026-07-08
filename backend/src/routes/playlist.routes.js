import { Router } from "express";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validateObjectId, validateBodyFields } from "../middlewares/validate.middleware.js";

const router = Router()

router.use(verifyJWT)

// POST / - Create a new playlist
router.route("/").post(validateBodyFields(["name"]), createPlaylist)

// GET /user/:userId - Get all playlists of a user
router.route("/user/:userId").get(validateObjectId("userId"), getUserPlaylists)

// GET /:playlistId - Get playlist by ID
// DELETE /:playlistId - Delete playlist
// PATCH /:playlistId - Update playlist name/description
router.route("/:playlistId")
    .get(validateObjectId("playlistId"), getPlaylistById)
    .delete(validateObjectId("playlistId"), deletePlaylist)
    .patch(validateObjectId("playlistId"), validateBodyFields(["name", "description"]), updatePlaylist)

// PATCH /add/:videoId/:playlistId - Add video to playlist
router.route("/add/:videoId/:playlistId").patch(validateObjectId("videoId"), validateObjectId("playlistId"), addVideoToPlaylist)

// PATCH /remove/:videoId/:playlistId - Remove video from playlist
router.route("/remove/:videoId/:playlistId").patch(validateObjectId("videoId"), validateObjectId("playlistId"), removeVideoFromPlaylist)

export default router;
