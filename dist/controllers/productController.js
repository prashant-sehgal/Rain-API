"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.createNewProduct = exports.getAllProducts = void 0;
var productModel_1 = __importDefault(require("../models/productModel"));
var RESTHandler_1 = require("../utils/RESTHandler");
exports.getAllProducts = (0, RESTHandler_1.getAll)(productModel_1.default);
exports.createNewProduct = (0, RESTHandler_1.createOne)(productModel_1.default);
exports.getProduct = (0, RESTHandler_1.getOne)(productModel_1.default);
exports.updateProduct = (0, RESTHandler_1.updateOne)(productModel_1.default);
exports.deleteProduct = (0, RESTHandler_1.deleteOne)(productModel_1.default);
