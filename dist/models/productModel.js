"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var slugify_1 = __importDefault(require("slugify"));
var productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'product must have a name'],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'product must have a description'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'product must have a price'],
    },
    discount: {
        type: {
            price: Number,
            expiresOn: Date,
        },
        validate: {
            validator: function (discount) {
                return Number(discount.expiresOn) > Date.now();
            },
            message: 'discount must expires in futute',
        },
    },
    ratingsAverage: {
        type: Number,
        max: [5.0, 'ratings must be equal or below 5.0'],
        min: [1.0, 'ratings must be equal or above 1.0'],
        default: 4.0,
    },
    recommended: {
        type: Boolean,
        default: false,
    },
    likes: {
        type: Number,
    },
    images: [String],
    slug: String,
    createdAt: {
        type: Date,
        default: Date.now(),
    },
}, {
    strict: true,
});
// create slug before saving documents
productSchema.pre('save', function () {
    this.slug = (0, slugify_1.default)(this.name.toLowerCase());
});
var Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
