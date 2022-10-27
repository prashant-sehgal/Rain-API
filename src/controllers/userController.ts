import { NextFunction, query, Request, Response } from 'express'
import multer from 'multer'

import RequestInterface from '../models/Interfaces/RequestInterface'
import User from '../models/userModel'
import { AppError, CatchAsync } from '../utils/GlobalErrorHandler'
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from '../utils/RESTHandler'

const upload = multer({
    storage: multer.diskStorage({
        destination: (request: Request, file: any, cb) => {
            cb(null, `${__dirname}/../../public/img/users`)
        },
        filename: (request: RequestInterface, file: any, cb) => {
            const extension = file.mimetype.split('/')[1]
            cb(null, `user-${request.user.id}-${Date.now()}.${extension}`)
        },
    }),
    fileFilter: (req: Request, file: any, cb) => {
        if (!(file.mimetype.split('/')[0] === 'image')) {
            cb(null, false)
        }
        cb(null, true)
    },
})

export const uploadUserImage = upload.single('image')

export const getAllUser = getAll(User)

export const createNewUser = createOne(User)

export const getUser = getOne(User)

export const updateUser = updateOne(User)

export const deleteUser = deleteOne(User)

export const updateMe = CatchAsync(
    async (
        request: RequestInterface,
        response: Response,
        next: NextFunction
    ) => {
        const { name, address } = request.body

        request.user.name = name
        request.user.address = address
        request.user.image = request.file.filename
        await request.user.save({ validateBeforeSave: false })

        response.status(201).json({
            status: 'success',
            message: 'data updated successfully',
        })
    }
)

export const updateMyPassword = CatchAsync(
    async (
        request: RequestInterface,
        response: Response,
        next: NextFunction
    ) => {
        const { password, newPassword, confirmPassword } = request.body

        if (!(await request.user.verifyPassword(password))) {
            return next(new AppError('current password is wrong', 401))
        }

        request.user.password = newPassword
        request.user.confirmPassword = confirmPassword
        await request.user.save()

        response.status(201).json({
            status: 'success',
            message: 'password updates successfully',
        })
    }
)
