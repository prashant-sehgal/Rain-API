import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

// Global error handler middleware
import globalErrorhandler, { AppError } from './utils/GlobalErrorHandler'

// routers
import productRouter from './routes/productRoutes'
import userRouter from './routes/userRoutes'
import orderRouter from './routes/orderRoutes'
import reviewRouter from './routes/reviewRoutes'

const app = express() // initializing app

// Global middlewares

// 1) import json data from request to request.body
app.use(express.json())

// 2) logging request data to console in development phase
if (process.env.NODE_ENV?.trim() === 'development') app.use(morgan('dev'))

// 3) exposing static files to public
app.use(express.static(`${__dirname}/../public`))

// 4) parsing cookies from request to request.cookies
app.use(cookieParser())

// 5) import form data to request.body
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

// uhandled routes
app.all('*', (request: Request, response: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${request.originalUrl} on this server`, 404))
})

// using error handler, each error passed by next function enters here
app.use(globalErrorhandler)

export default app
