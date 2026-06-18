import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getChannelStats } from "../controllers/dashboard.controller";

const router = Router()

app.use(verifyJWT)

//routes
router.route("/stats").get(getChannelStats)

export default router