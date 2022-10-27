import { NextFunction, Request, Response } from 'express'
import RequestInterface from '../models/Interfaces/RequestInterface'
import Review from '../models/reviewModel'
import User from '../models/userModel'
import { CatchAsync } from '../utils/GlobalErrorHandler'
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from '../utils/RESTHandler'

export const parseRefactorReviewData = CatchAsync(
    async (
        request: RequestInterface,
        response: Response,
        next: NextFunction
    ) => {
        request.body.user = request.user.id
        next()
    }
)

export const addReview = createOne(Review)

export const getMyReviews = CatchAsync(
    async (
        request: RequestInterface,
        response: Response,
        next: NextFunction
    ) => {
        const reviews = await Review.find({ user: request.user.id })
        return response.status(200).json({
            status: 'success',
            length: reviews.length,
            data: {
                reviews,
            },
        })
    }
)

export const getAllReviews = getAll(Review)
export const createNewReview = createOne(Review)
export const getReview = getOne(Review)
export const updateReview = updateOne(Review)
export const deleteReview = deleteOne(Review)
