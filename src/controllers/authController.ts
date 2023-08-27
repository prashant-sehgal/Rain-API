import { Request, Response, NextFunction, RequestHandler } from 'express'
import { readFile } from 'fs/promises'
import jwt from 'jsonwebtoken'

import RequestInterface from '../models/Interfaces/RequestInterface'
import User, { UserInterface } from '../models/userModel'
import { sendEmail } from '../utils/Email'
import { AppError, CatchAsync } from '../utils/GlobalErrorHandler'

const sendUserTokenCookie = (user: UserInterface, response: Response) => {
    const token = jwt.sign({ id: user.id }, `${process.env.JWT_SECRET}`, {
        expiresIn: `${process.env.JWT_EXPIRES_IN}d`,
    })
    // console.log(token)
    const expiresIn = new Date(
        Date.now() + Number(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000
    )

    response.cookie('jwt', token, {
        expires: expiresIn,
        httpOnly: true,
    })

    response.status(200).json({
        status: 'success',
        jwt,
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
        },
    })
}

export const signup = CatchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const { name, email, password, confirmPassword } = request.body
        const user = await User.create({
            name,
            email,
            password,
            confirmPassword,
        })

        sendUserTokenCookie(user, response)
    }
)

export const login = CatchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const { email, password } = request.body

        // check if email and password are in body
        if (!email || !password) {
            return next(
                new AppError('please provide username and password', 400)
            )
        }

        // chech if user exists and password is correct
        const user = await User.findOne({ email })

        if (!user || !(await user.verifyPassword(password))) {
            return next(new AppError('email or password is incorrect', 401))
        }

        // login user in
        sendUserTokenCookie(user, response)
    }
)

export const protect = CatchAsync(
    async (
        request: RequestInterface,
        response: Response,
        next: NextFunction
    ) => {
        const token = request.cookies.jwt || request.body.jwt

        // if token exists
        if (!token)
            return next(
                new AppError(
                    'You are not logged in! Please login to get access',
                    401
                )
            )

        // decode jwt token
        const decoded: any = jwt.verify(token, `${process.env.JWT_SECRET}`)

        // check if user still exists
        const user = await User.findById(decoded.id)
        if (!user) {
            return next(
                new AppError('user does not exists with this email id', 401)
            )
        }

        // check if user changed password after token is created
        if (user.changePasswordAfter(decoded.exp))
            return next(
                new AppError('user changed password, please login again.', 401)
            )

        // pass user to next middleware
        request.user = user
        next()
    }
)

export const restrictTo = (...roles: string[]): any => {
    return (
        request: RequestInterface,
        response: Response,
        next: NextFunction
    ) => {
        if (!roles.includes(request.user.role)) {
            return next(
                new AppError(
                    'You are not authoirized to perform this action',
                    403
                )
            )
        }
        next()
    }
}

export const forgotPassword = CatchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        // fetching user
        const { email } = request.body
        const user = await User.findOne({ email })

        if (!user)
            return next(
                new AppError('User with this email id does not exists', 404)
            )

        // generating password reset session and returning token
        const resetToken = await user.createResetPasswordSession()

        // creating reset url to send over the user email
        const resetUrl = `${request.protocol}://${request.get(
            'host'
        )}/api/v1/users/resetPassword/${resetToken}`

        // fetching reset email html
        let resetEmailHtml = (
            await readFile(`${__dirname}/../../views/emails/resetEmail.html`)
        ).toString()

        // replacing placeholders in html body with actual data
        resetEmailHtml = resetEmailHtml.replace('%USERNAME%', user.name)
        resetEmailHtml = resetEmailHtml.replace('%RESET_URL%', resetUrl)

        try {
            // sending email
            await sendEmail(user.email, 'Reset Password', resetEmailHtml)
        } catch (err) {
            user.passwordResetSessionExpiresIn = undefined
            user.passwordResetToken = undefined
            user.save({ validateBeforeSave: false })
            // sending back response
            return next(
                new AppError(
                    'Some problem in sending email! Please try later',
                    500
                )
            )
        }

        // sending back response
        response.json({
            status: 'success',
            message:
                'reset email send to your email address. Please hurry! you have just 5 minutes to reset your password',
        })
    }
)

export const resetPassword = CatchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const { passwordResetToken } = request.params

        const user = await User.findOne({
            passwordResetToken,
            passwordResetSessionExpiresIn: { $gt: Date.now() },
        })

        if (!user) {
            return next(new AppError('reset session is alredy expired', 400))
        }

        user.password = request.body.password
        user.confirmPassword = request.body.confirmPassword
        user.passwordResetSessionExpiresIn = undefined
        user.passwordResetToken = undefined

        await user.save()

        sendUserTokenCookie(user, response)
    }
)
