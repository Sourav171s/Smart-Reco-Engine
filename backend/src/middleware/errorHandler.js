// as we want that all error responsed must look the same
//Without this, one controller might send an error as a string, another as an object, and another might forget to set the status code

const errorHandler = (err,req,res,next) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;            //because ifbychance status code has not been setup so express by defalt set it to 200
                                                                                //so we convert it to 500 because 200 means success which is wrong for an error
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });

};
export default errorHandler;