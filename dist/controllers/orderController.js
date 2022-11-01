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
exports.deleteOrder = exports.getOrder = exports.updateOrder = exports.createNewOrder = exports.getAllOrders = exports.getMyOrders = exports.createOrder = exports.createOrderObject = exports.getCheckoutSession = void 0;
var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
var orderModel_1 = __importDefault(require("../models/orderModel"));
var productModel_1 = __importDefault(require("../models/productModel"));
var GlobalErrorHandler_1 = require("../utils/GlobalErrorHandler");
var RESTHandler_1 = require("../utils/RESTHandler");
exports.getCheckoutSession = (0, GlobalErrorHandler_1.CatchAsync)(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var line_items, success_url, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(request.body.products.map(function (product) { return __awaiter(void 0, void 0, void 0, function () {
                    var productItem;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, productModel_1.default.findById(product.id)];
                            case 1:
                                productItem = _a.sent();
                                if (productItem !== null && productItem.images !== undefined) {
                                    return [2 /*return*/, {
                                            price_data: {
                                                currency: 'inr',
                                                unit_amount: productItem.price * 100,
                                                product_data: {
                                                    name: productItem.name,
                                                    description: productItem.description,
                                                    images: [
                                                        "https://raw.githubusercontent.com/prashant-sehgal/Rain-images/main/img/products/".concat(productItem.images[0]),
                                                    ],
                                                },
                                            },
                                            quantity: product.quantity,
                                        }];
                                }
                                return [2 /*return*/];
                        }
                    });
                }); }))];
            case 1:
                line_items = _a.sent();
                success_url = "".concat(request.protocol, "://").concat(request.get('host'), "/api/v1/orders/createMyOrder?");
                request.body.products.forEach(function (product) {
                    success_url += "products=".concat(product.id, ",").concat(product.quantity, "&");
                });
                return [4 /*yield*/, stripe.checkout.sessions.create({
                        payment_method_types: ['card'],
                        mode: 'payment',
                        success_url: success_url,
                        cancel_url: "".concat(request.protocol, "://").concat(request.get('host'), "/error.html"),
                        customer_email: request.user.email,
                        line_items: line_items,
                    })];
            case 2:
                session = _a.sent();
                return [2 /*return*/, response.status(200).json({
                        status: 'success',
                        session: session,
                    })];
        }
    });
}); });
exports.createOrderObject = (0, GlobalErrorHandler_1.CatchAsync)(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var products, requestBody;
    return __generator(this, function (_a) {
        products = request.query.products;
        if (typeof request.query.products === 'string') {
            products = [request.query.products];
        }
        requestBody = {
            user: request.user.id,
            products: products.map(function (product) {
                var dataItems = product.split(',');
                return {
                    product: dataItems[0],
                    quantity: Number(dataItems[1]),
                };
            }),
        };
        request.body = requestBody;
        next();
        return [2 /*return*/];
    });
}); });
exports.createOrder = (0, GlobalErrorHandler_1.CatchAsync)(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var order;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, orderModel_1.default.create(request.body)];
            case 1:
                order = _a.sent();
                return [2 /*return*/, response.redirect("/orders")];
        }
    });
}); });
exports.getMyOrders = (0, GlobalErrorHandler_1.CatchAsync)(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var orders;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, orderModel_1.default.find({ user: request.user.id }).select('products totalPrize completed createdAt -user -_id')];
            case 1:
                orders = _a.sent();
                return [2 /*return*/, response.status(200).json({
                        status: 'success',
                        length: orders.length,
                        data: {
                            orders: orders,
                        },
                    })];
        }
    });
}); });
exports.getAllOrders = (0, RESTHandler_1.getAll)(orderModel_1.default);
exports.createNewOrder = (0, RESTHandler_1.createOne)(orderModel_1.default);
exports.updateOrder = (0, RESTHandler_1.updateOne)(orderModel_1.default);
exports.getOrder = (0, RESTHandler_1.getOne)(orderModel_1.default);
exports.deleteOrder = (0, RESTHandler_1.deleteOne)(orderModel_1.default);
