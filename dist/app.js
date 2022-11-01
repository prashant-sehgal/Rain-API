"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
// Global error handler middleware
var GlobalErrorHandler_1 = __importStar(require("./utils/GlobalErrorHandler"));
// routers
var productRoutes_1 = __importDefault(require("./routes/productRoutes"));
var userRoutes_1 = __importDefault(require("./routes/userRoutes"));
var orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
var reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
var app = (0, express_1.default)(); // initializing app
// Global middlewares
// implementing cors
app.use((0, cors_1.default)());
app.options('*', (0, cors_1.default)());
// 1) import json data from request to request.body
app.use(express_1.default.json());
// 2) logging request data to console in development phase
if (((_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.trim()) === 'development')
    app.use((0, morgan_1.default)('dev'));
// 3) exposing static files to public
app.use(express_1.default.static("".concat(__dirname, "/../public")));
// 4) parsing cookies from request to request.cookies
app.use((0, cookie_parser_1.default)());
// 5) import form data to request.body
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/v1/orders', orderRoutes_1.default);
app.use('/api/v1/products', productRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/reviews', reviewRoutes_1.default);
// uhandled routes
app.all('*', function (request, response, next) {
    next(new GlobalErrorHandler_1.AppError("Can't find ".concat(request.originalUrl, " on this server"), 404));
});
// using error handler, each error passed by next function enters here
app.use(GlobalErrorHandler_1.default);
exports.default = app;
