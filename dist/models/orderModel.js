"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var orderSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'order must belong to a user'],
    },
    products: {
        type: [
            {
                product: {
                    type: mongoose_1.default.Types.ObjectId,
                    ref: 'Product',
                    requried: [true, 'order must contain product'],
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
    },
    completed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
orderSchema.pre(/^find/, function () {
    this.populate({
        path: 'user',
        select: 'name email address',
    });
    this.populate({
        path: 'products.product',
        select: 'name price',
    });
});
orderSchema.virtual('totalPrice').get(function () {
    var totalPrice = 0;
    this.products.forEach(function (product) {
        totalPrice += product.product.price * product.quantity;
    });
    return totalPrice;
});
var Order = mongoose_1.default.model('Order', orderSchema);
exports.default = Order;
