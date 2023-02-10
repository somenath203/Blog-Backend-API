const globalErrorHandler = (err, req, res, next) => {

    const stack = err.stack;

    const message = err.message;

    const status = err.status ? err.status : 'failed';

    const statusCode = err?.statusCode ? err.statusCode : 500;


    res.status(statusCode).json({
        status: status,
        message: message,
        stack: stack
    });


};


module.exports = globalErrorHandler;