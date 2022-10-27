import mongoose from 'mongoose'
import { ProductInterface } from './productModel'
import { UserInterface } from './userModel'

export interface ReviewInterface {
    user: UserInterface
    product: ProductInterface
    rating: number
    thought: string
    createdAt: Date
}

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'review must belongs to any user'],
    },
    product: {
        type: mongoose.Types.ObjectId,
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
})

const Review = mongoose.model<ReviewInterface>('Review', reviewSchema)
export default Review
