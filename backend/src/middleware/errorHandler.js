// as we want that all error responsed must look the same
//Without this, one controller might send an error as a string, another as an object, and another might forget to set the status code

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let statusCode = res.statusCode >= 400 ? res.statusCode : 500;
    if (err.name === "CastError" || err.name === "ValidationError") {
        statusCode = 400;
    } else if (err.code === 11000) {
        statusCode = 409;
    }

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};
export default errorHandler;
