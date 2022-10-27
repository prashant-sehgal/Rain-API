import { Response, NextFunction, request, Request } from 'express'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
import Order from '../models/orderModel'

import RequestInterface from '../models/Interfaces/RequestInterface'
import Product from '../models/productModel'
import { CatchAsync } from '../utils/GlobalErrorHandler'
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from '../utils/RESTHandler'

export const getCheckoutSession = CatchAsync(
    async (
        request: RequestInterface,
        response: Response,
        next: NextFunction
    ) => {
        const line_items = await Promise.all(
            request.body.products.map(async (product: any) => {
                const productItem = await Product.findById(product.id)

                if (productItem !== null && productItem.images !== undefined) {
                    return {
                        price_data: {
                            currency: 'inr',
                            unit_amount: productItem.price * 100,
                            product_data: {
                                name: productItem.name,
                                description: productItem.description,
                                images: [
                                    `https://raw.githubusercontent.com/prashant-sehgal/Rain-images/main/img/products/${productItem.images[0]}`,
                                ],
                            },
                        },
                        quantity: product.quantity,
                    }
                }
            })
        )

        let success_url = `${request.protocol}://${request.get(
            'host'
        )}/api/v1/orders/createMyOrder?`

        request.body.products.forEach((product: any) => {
            success_url += `products=${product.id},${product.quantity}&`
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url,
            cancel_url: `${request.protocol}://${request.get(
                'host'
            )}/error.html`,
            customer_email: request.user.email,
            line_items,
        })

        return response.status(200).json({
            status: 'success',
            session,
        })
    }
)

export const createOrderObject = CatchAsync(
    async (
        request: RequestInterface,
        response: Response,
        next: NextFunction
    ) => {
        let products: any = request.query.products

        if (typeof request.query.products === 'string') {
            products = [request.query.products]
        }

        const requestBody = {
            user: request.user.id,
            products: products.map((product: any) => {
                const dataItems = product.split(',')
                return {
                    product: dataItems[0],
                    quantity: Number(dataItems[1]),
                }
            }),
        }
        request.body = requestBody
        next()
    }
)

export const createOrder = CatchAsync(
    async (
        request: RequestInterface,
        response: Response,
        next: NextFunction
    ) => {
        const order = await Order.create(request.body)
        return response.redirect(`/orders`)
    }
)

export const getMyOrders = CatchAsync(
    async (
        request: RequestInterface,
        response: Response,
        next: NextFunction
    ) => {
        const orders = await Order.find({ user: request.user.id }).select(
            'products totalPrize completed createdAt -user -_id'
        )
        return response.status(200).json({
            status: 'success',
            length: orders.length,
            data: {
                orders,
            },
        })
    }
)

export const getAllOrders = getAll(Order)
export const createNewOrder = createOne(Order)
export const updateOrder = updateOne(Order)
export const getOrder = getOne(Order)
export const deleteOrder = deleteOne(Order)
