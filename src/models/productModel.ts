import mongoose from 'mongoose'
import slugify from 'slugify'

export interface ProductInterface {
    id: string
    name: string
    description: string
    price: number
    discount?: { price: number; expiresOn: Date }
    ratingsAverage?: number
    recommended?: boolean
    likes?: number
    images?: string[]
    slug?: string
    createdAt: Date
}

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'product must have a name'],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'product must have a description'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'product must have a price'],
        },
        discount: {
            type: {
                price: Number,
                expiresOn: Date,
            },
            validate: {
                validator: function (
                    this: ProductInterface,
                    discount: { price: number; expiresOn: Date }
                ) {
                    return Number(discount.expiresOn) > Date.now()
                },
                message: 'discount must expires in futute',
            },
        },
        ratingsAverage: {
            type: Number,
            max: [5.0, 'ratings must be equal or below 5.0'],
            min: [1.0, 'ratings must be equal or above 1.0'],
            default: 4.0,
        },
        recommended: {
            type: Boolean,
            default: false,
        },
        likes: {
            type: Number,
        },
        images: [String],
        slug: String,
        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        strict: true,
    }
)

// create slug before saving documents
productSchema.pre('save', function (this: ProductInterface) {
    this.slug = slugify(this.name.toLowerCase())
})

const Product = mongoose.model<ProductInterface>('Product', productSchema)
export default Product
