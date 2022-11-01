"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUncaughtException = exports.handleUnhandledRejection = exports.AppError = exports.CatchAsync = void 0;
// function that can catch errors in async functions and pass them directly to gloabl error handler
var CatchAsync = function (fun) {
    return function (request, response, next) {
        fun(request, response, next).catch(next);
    };
};
exports.CatchAsync = CatchAsync;
// AppError class
var AppError = /** @class */ (function (_super) {
    __extends(AppError, _super);
    function AppError(message, statusCode) {
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        _this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
        _this.isOperational = true;
        return _this;
    }
    return AppError;
}(Error));
exports.AppError = AppError;
// handle unhandledRejection
var handleUnhandledRejection = function (server, error) {
    server.close(function () {
        console.log('💥💥💥 Unhandled Rejection');
        console.log(error);
    });
};
exports.handleUnhandledRejection = handleUnhandledRejection;
// hanlde uncaughtException
var handleUncaughtException = function (error) {
    console.log('💣💣💣 Unhandled Exception');
    console.log(error);
    process.exit(-1);
};
exports.handleUncaughtException = handleUncaughtException;
// send full error to programmer on development mode
var sendErrorDev = function (error, response) {
    response.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack,
    });
};
// handle mongodb id cast error in production
var handleMongodbCastError = function (error) {
    return new AppError("Invalid ".concat(error.path, " : ").concat(error.value), 400);
};
// handle mongodb duplicate field error in production
var handleMongodbDuplicateFieldError = function (error) {
    return new AppError("Duplicate field value \"".concat(error.keyValue.name, "\" Please use another value!"), 400);
};
// handle mongodb validation error in production
var handleMongodbValidation = function (error) {
    return new AppError(error.message, 400);
};
// send error in production. if operational than send error message, if not, then send generic error message of something went very wrong
var sendErrorProd = function (error, response) {
    if (error.isOperational) {
        response.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    }
    else {
        response.status(500).json({
            status: 'error',
            message: 'something went very wrong',
        });
    }
};
// global error handling middleware
exports.default = (function (error, request, response, next) {
    var _a, _b;
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    if (((_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.trim()) === 'development')
        sendErrorDev(error, response);
    else if (((_b = process.env.NODE_ENV) === null || _b === void 0 ? void 0 : _b.trim()) === 'production') {
        var errorCopy = Object.assign(error);
        if (error.name === 'CastError')
            errorCopy = handleMongodbCastError(errorCopy);
        else if (error.code === 11000)
            errorCopy = handleMongodbDuplicateFieldError(errorCopy);
        else if (error.name === 'ValidationError')
            errorCopy = handleMongodbValidation(errorCopy);
        sendErrorProd(errorCopy, response);
    }
});
