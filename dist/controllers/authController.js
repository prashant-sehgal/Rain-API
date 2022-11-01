"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.restrictTo = exports.protect = exports.login = exports.signup = void 0;
var promises_1 = require("fs/promises");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var userModel_1 = __importDefault(require("../models/userModel"));
var Email_1 = require("../utils/Email");
var GlobalErrorHandler_1 = require("../utils/GlobalErrorHandler");
var sendUserTokenCookie = function (user, response) {
    var token = jsonwebtoken_1.default.sign({ id: user.id }, "".concat(process.env.JWT_SECRET), {
        expiresIn: "".concat(process.env.JWT_EXPIRES_IN, "d"),
    });
    // console.log(token)
    response.cookie('jwt', token, {
        expires: new Date(Date.now() +
            Number(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000),
        httpOnly: true,
    });
    response.status(200).json({
        status: 'success',
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
        },
    });
};
exports.signup = (0, GlobalErrorHandler_1.CatchAsync)(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, password, confirmPassword, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = request.body, name = _a.name, email = _a.email, password = _a.password, confirmPassword = _a.confirmPassword;
                return [4 /*yield*/, userModel_1.default.create({
                        name: name,
                        email: email,
                        password: password,
                        confirmPassword: confirmPassword,
                    })];
            case 1:
                user = _b.sent();
                sendUserTokenCookie(user, response);
                return [2 /*return*/];
        }
    });
}); });
exports.login = (0, GlobalErrorHandler_1.CatchAsync)(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = request.body, email = _a.email, password = _a.password;
                // check if email and password are in body
                if (!email || !password) {
                    return [2 /*return*/, next(new GlobalErrorHandler_1.AppError('please provide username and password', 400))];
                }
                return [4 /*yield*/, userModel_1.default.findOne({ email: email })];
            case 1:
                user = _c.sent();
                _b = !user;
                if (_b) return [3 /*break*/, 3];
                return [4 /*yield*/, user.verifyPassword(password)];
            case 2:
                _b = !(_c.sent());
                _c.label = 3;
            case 3:
                if (_b) {
                    return [2 /*return*/, next(new GlobalErrorHandler_1.AppError('email or password is incorrect', 401))];
                }
                // login user in
                sendUserTokenCookie(user, response);
                return [2 /*return*/];
        }
    });
}); });
exports.protect = (0, GlobalErrorHandler_1.CatchAsync)(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = request.cookies.jwt;
                // if token exists
                if (!token)
                    return [2 /*return*/, next(new GlobalErrorHandler_1.AppError('You are not logged in! Please login to get access', 401))
                        // decode jwt token
                    ];
                decoded = jsonwebtoken_1.default.verify(token, "".concat(process.env.JWT_SECRET));
                return [4 /*yield*/, userModel_1.default.findById(decoded.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, next(new GlobalErrorHandler_1.AppError('user does not exists with this email id', 401))];
                }
                // check if user changed password after token is created
                if (user.changePasswordAfter(decoded.exp))
                    return [2 /*return*/, next(new GlobalErrorHandler_1.AppError('user changed password, please login again.', 401))
                        // pass user to next middleware
                    ];
                // pass user to next middleware
                request.user = user;
                next();
                return [2 /*return*/];
        }
    });
}); });
var restrictTo = function () {
    var roles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        roles[_i] = arguments[_i];
    }
    return function (request, response, next) {
        if (!roles.includes(request.user.role)) {
            return next(new GlobalErrorHandler_1.AppError('You are not authoirized to perform this action', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
exports.forgotPassword = (0, GlobalErrorHandler_1.CatchAsync)(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, resetToken, resetUrl, resetEmailHtml, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = request.body.email;
                return [4 /*yield*/, userModel_1.default.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, next(new GlobalErrorHandler_1.AppError('User with this email id does not exists', 404))
                        // generating password reset session and returning token
                    ];
                return [4 /*yield*/, user.createResetPasswordSession()
                    // creating reset url to send over the user email
                ];
            case 2:
                resetToken = _a.sent();
                resetUrl = "".concat(request.protocol, "://").concat(request.get('host'), "/api/v1/users/resetPassword/").concat(resetToken);
                return [4 /*yield*/, (0, promises_1.readFile)("".concat(__dirname, "/../../views/emails/resetEmail.html"))];
            case 3:
                resetEmailHtml = (_a.sent()).toString();
                // replacing placeholders in html body with actual data
                resetEmailHtml = resetEmailHtml.replace('%USERNAME%', user.name);
                resetEmailHtml = resetEmailHtml.replace('%RESET_URL%', resetUrl);
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                // sending email
                return [4 /*yield*/, (0, Email_1.sendEmail)(user.email, 'Reset Password', resetEmailHtml)];
            case 5:
                // sending email
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                user.passwordResetSessionExpiresIn = undefined;
                user.passwordResetToken = undefined;
                user.save({ validateBeforeSave: false });
                // sending back response
                return [2 /*return*/, next(new GlobalErrorHandler_1.AppError('Some problem in sending email! Please try later', 500))];
            case 7:
                // sending back response
                response.json({
                    status: 'success',
                    message: 'reset email send to your email address. Please hurry! you have just 5 minutes to reset your password',
                });
                return [2 /*return*/];
        }
    });
}); });
exports.resetPassword = (0, GlobalErrorHandler_1.CatchAsync)(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var passwordResetToken, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                passwordResetToken = request.params.passwordResetToken;
                return [4 /*yield*/, userModel_1.default.findOne({
                        passwordResetToken: passwordResetToken,
                        passwordResetSessionExpiresIn: { $gt: Date.now() },
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, next(new GlobalErrorHandler_1.AppError('reset session is alredy expired', 400))];
                }
                user.password = request.body.password;
                user.confirmPassword = request.body.confirmPassword;
                user.passwordResetSessionExpiresIn = undefined;
                user.passwordResetToken = undefined;
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                sendUserTokenCookie(user, response);
                return [2 /*return*/];
        }
    });
}); });
