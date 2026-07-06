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
        const missing = requiredFields.filter(field => {
            const val = req.body[field];
            // treat missing, null, non-string, or blank values as missing
            return val === undefined || val === null || String(val).trim() === '';
        });
        if (missing.length > 0) {
            return next(new ApiError(400, `all fields are required (missing: ${missing.join(', ')})`));
        }
        next();
    };
};
