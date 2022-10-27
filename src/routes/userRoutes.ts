import express from 'express'

import * as authController from '../controllers/authController'
import * as userController from '../controllers/userController'

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/forgotPassword', authController.forgotPassword)
router
    .route('/resetPassword/:passwordResetToken')
    .post(authController.resetPassword)

router.use(authController.protect)

router.post('/updateMyPassword', userController.updateMyPassword)
router.post(
    '/updateMe',
    userController.uploadUserImage,
    userController.updateMe
)

router.use(authController.restrictTo('admin'))

router
    .route('/')
    .get(userController.getAllUser)
    .post(userController.createNewUser)

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

export default router
