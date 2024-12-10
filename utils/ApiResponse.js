class ApiResponse {
    constructor(statusCode, success, message, data = null, errors = null) {
        this.statusCode = statusCode
        this.success = success
        this.message = message
        this.data = success ? data : null
        this.errors = !success ? errors : null
    }
}

export {
    ApiResponse
}