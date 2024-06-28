const handleResponseSuccess = (res, statusCode, message, data = {}) => {
    res.status(statusCode).json({
        message,
        data
    })
}

const handleResponseError = (res, statusCode, message) => {
    res.status(statusCode).json({
        message,
    })
}

module.exports = {
    handleResponseSuccess,
    handleResponseError,
}