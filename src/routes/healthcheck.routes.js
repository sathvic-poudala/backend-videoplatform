import router from "express";

const healthCheckRouter = router()

healthCheckRouter.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "API is healthy",
    })
})

export default healthCheckRouter;