// Wraps async controller functions to automatically forward
// rejected promises to Express error-handling middleware via next().
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).
        catch((err) => next(err));
    }
}

export { asyncHandler }