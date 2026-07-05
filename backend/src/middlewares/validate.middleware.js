import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export const validateObjectId = (paramName) => {
    return (req, res, next) => {
        const id = req.params[paramName];
        if (!id || !mongoose.isValidObjectId(id)) {
            throw new ApiError(400, `Invalid ${paramName}`);
        }
        next();
    };
};

export const validateBodyFields = (requiredFields) => {
    return (req, res, next) => {
        const missing = requiredFields.filter(field => !req.body[field] || req.body[field].trim() === '');
        if (missing.length > 0) {
            throw new ApiError(400, `all fields are required (missing: ${missing.join(', ')})`);
        }
        next();
    };
};
