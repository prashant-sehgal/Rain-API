import express from 'express'
import { protect, restrictTo } from '../controllers/authController'
import * as reviewController from '../controllers/reviewController'

const router = express.Router()

router.use(protect)

router
    .route('/addReview')
    .post(reviewController.parseRefactorReviewData, reviewController.addReview)

router.route('/myReviews').get(reviewController.getMyReviews)

router.use(restrictTo('admin'))

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(reviewController.createNewReview)

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview)
export default router
