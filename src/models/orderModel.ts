import mongoose, { Query } from 'mongoose'
import { ProductInterface } from './productModel'
import { UserInterface } from './userModel'

interface ProductInter {
    product: ProductInterface
    quantity: number
}

interface OrderInterface {
    id: string
    user: UserInterface
    products: ProductInter[]
    totalPrice: number
    completed: boolean
    createdAt: Date
}

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'order must belong to a user'],
        },
        products: {
            type: [
                {
                    product: {
                        type: mongoose.Types.ObjectId,
                        ref: 'Product',
                        requried: [true, 'order must contain product'],
                    },
                    quantity: {
                        type: Number,
                        default: 1,
                    },
                },
            ],
        },
        completed: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

orderSchema.pre(/^find/, function (this: any) {
    this.populate({
        path: 'user',
        select: 'name email address',
    })
    this.populate({
        path: 'products.product',
        select: 'name price',
    })
})

orderSchema.virtual('totalPrice').get(function (this: OrderInterface) {
    let totalPrice = 0
    this.products.forEach((product: ProductInter) => {
        totalPrice += product.product.price * product.quantity
    })
    return totalPrice
})

const Order = mongoose.model<OrderInterface>('Order', orderSchema)
export default Order
