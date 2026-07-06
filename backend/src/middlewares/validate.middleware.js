import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export const validateObjectId = (paramName) => {
    return (req, _res, next) => {
        const id = req.params[paramName];
        if (!id || !mongoose.isValidObjectId(id)) {
            return next(new ApiError(400, `Invalid ${paramName}`));
        }
        next();
    };
};

export const validateBodyFields = (requiredFields) => {
    return (req, _res, next) => {
        if (typeof req.body === 'undefined') {
            return next(new ApiError(400, "Request body is empty or missing. Set Content-Type: application/json"));
        }
        const missing = requiredFields.filter(field => {
            const val = req.body[field];
            return val === undefined || val === null || String(val).trim() === '';
        });
        if (missing.length > 0) {
            return next(new ApiError(400, `all fields are required (missing: ${missing.join(', ')})`));
        }
        next();
    };
};
