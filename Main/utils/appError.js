class AppError extends Error{
    constructor(message , code , statusCode){
        super(message , code)
        this.statusCode = statusCode || 500
        this.status = `${statusCode}`.startsWith('4')?'fail':'Error'
        this.isOperational = true;

        Error.captureStackTrace(this , this.constructor)
    }
}

// this is the instance object where we extend the inbulit Error class and then we give all this code message blaaa blaa

 module.exports = AppError