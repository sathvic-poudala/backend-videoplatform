// Standardized API response wrapper.
// Enforces consistent structure: success, statusCode, message, data.
class ApiResponse {
    constructor(statusCode, message = 'Success', data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }
}

export { ApiResponse }