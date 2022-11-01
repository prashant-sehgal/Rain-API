"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import all configuration data, before any actual execution
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: "".concat(__dirname, "/../config.env") });
var GlobalErrorHandler_1 = require("./utils/GlobalErrorHandler");
// handling uncaught exception on server
process.on('uncaughtException', GlobalErrorHandler_1.handleUncaughtException);
// Starting actual application
var mongoose_1 = __importDefault(require("mongoose"));
var app_1 = __importDefault(require("./app"));
// connecting application to mongodb server
mongoose_1.default.connect("".concat(process.env.MONGODB)).then(function () {
    console.log('DB connected successfully ✔');
});
// running server
var server = app_1.default.listen(process.env.PORT, function () {
    console.log("server is running on port ".concat(process.env.PORT));
});
// handling unhandled rejection on server
process.on('unhandledRejection', function (error) {
    (0, GlobalErrorHandler_1.handleUnhandledRejection)(server, error);
});
