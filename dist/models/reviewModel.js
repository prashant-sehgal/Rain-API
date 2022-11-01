"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var reviewSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: [true, 'review must belongs to any user'],
    },
    product: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Product',
        required: [true, 'review must belongs to any product'],
    },
    rating: {
        type: Number,
        max: [5, 'rating should be equal or less than 5.0'],
        min: [1, 'rating should be equal or more than 1.0'],
    },
    thought: {
        type: String,
        required: [true, 'Reveiw can not be empty'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
var Review = mongoose_1.default.model('Review', reviewSchema);
exports.default = Review;
