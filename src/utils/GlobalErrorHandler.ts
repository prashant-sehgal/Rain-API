import { Request, Response, NextFunction } from 'express'

// function that can catch errors in async functions and pass them directly to gloabl error handler
export const CatchAsync = (fun: Function) => {
    return (request: Request, response: Response, next: NextFunction) => {
        fun(request, response, next).catch(next)
    }
}

// AppError class
export class AppError extends Error {
    statusCode: number
    status: string
    isOperational: boolean
    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
        this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error'
        this.isOperational = true
    }
}

// handle unhandledRejection
export const handleUnhandledRejection = (server: any, error: any) => {
    server.close(() => {
        console.log('💥💥💥 Unhandled Rejection')
        console.log(error)
    })
}

// hanlde uncaughtException
export const handleUncaughtException = (error: any) => {
    console.log('💣💣💣 Unhandled Exception')
    console.log(error)
    process.exit(-1)
}

// send full error to programmer on development mode
const sendErrorDev = (error: any, response: Response) => {
    response.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack,
    })
}

// handle mongodb id cast error in production
const handleMongodbCastError = (error: any) => {
    return new AppError(`Invalid ${error.path} : ${error.value}`, 400)
}

// handle mongodb duplicate field error in production
const handleMongodbDuplicateFieldError = (error: any) => {
    return new AppError(
        `Duplicate field value "${error.keyValue.name}" Please use another value!`,
        400
    )
}

// handle mongodb validation error in production
const handleMongodbValidation = (error: any) => {
    return new AppError(error.message, 400)
}

// send error in production. if operational than send error message, if not, then send generic error message of something went very wrong
const sendErrorProd = (error: any, response: Response) => {
    if (error.isOperational) {
        response.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        })
    } else {
        response.status(500).json({
            status: 'error',
            message: 'something went very wrong',
        })
    }
}

// global error handling middleware
export default (
    error: any,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    error.statusCode = error.statusCode || 500
    error.status = error.status || 'error'
    if (process.env.NODE_ENV?.trim() === 'development')
        sendErrorDev(error, response)
    else if (process.env.NODE_ENV?.trim() === 'production') {
        let errorCopy = Object.assign(error)

        if (error.name === 'CastError')
            errorCopy = handleMongodbCastError(errorCopy)
        else if (error.code === 11000)
            errorCopy = handleMongodbDuplicateFieldError(errorCopy)
        else if (error.name === 'ValidationError')
            errorCopy = handleMongodbValidation(errorCopy)

        sendErrorProd(errorCopy, response)
    }
}
