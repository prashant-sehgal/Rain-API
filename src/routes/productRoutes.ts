import express from 'express'
import * as authController from '../controllers/authController'

import * as productController from '../controllers/productController'

const router = express.Router()

// Routes
router
    .route('/')
    .get(productController.getAllProducts)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        productController.createNewProduct
    )

router
    .route('/:id')
    .get(productController.getProduct)
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        productController.updateProduct
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        productController.deleteProduct
    )

export default router
