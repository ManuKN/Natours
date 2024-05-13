class AppError extends Error{
    constructor(message , statusCode){
        super(message)
        this.statusCode = statusCode || 500
        this.status = `${statusCode}`.startsWith('4')?'fail':'Error'
        this.isOperational = true;

        Error.captureStackTrace(this , this.constructor)
    }
}

// this is the instanve object where we extend the inbulit Error object and then we give all this code message blaaa blaa

module.exports = AppError