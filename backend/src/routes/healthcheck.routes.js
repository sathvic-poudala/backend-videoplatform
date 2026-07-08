import { Router } from "express";

const healthCheckRouter = Router()

// GET / - Health check endpoint to verify API is running
healthCheckRouter.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "API is healthy",
    })
})

export default healthCheckRouter;
