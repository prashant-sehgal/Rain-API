import express from 'express'

import * as orderController from '../controllers/orderController'
import * as authController from '../controllers/authController'

const router = express.Router()

router.use(authController.protect)

router.route('/checkout-session').post(orderController.getCheckoutSession)

router
    .route('/createMyOrder')
    .get(orderController.createOrderObject, orderController.createOrder)

router.route('/getMyOrders').get(orderController.getMyOrders)

router.use(authController.restrictTo('admin'))

router
    .route('/')
    .get(orderController.getAllOrders)
    .post(orderController.createNewOrder)

router
    .route('/:id')
    .get(orderController.getOrder)
    .patch(orderController.updateOrder)
    .delete(orderController.deleteOrder)

export default router
