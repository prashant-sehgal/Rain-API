import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export interface UserInterface {
    id: string
    name: string
    email: string
    role: string
    password: string
    confirmPassword: string | undefined
    passwordCreatedAt: number
    image: string
    active: boolean
    telephone: string
    address: string
    passwordResetToken: string | undefined
    passwordResetSessionExpiresIn: number | undefined
    // methods
    isModified: Function
    verifyPassword: Function
    createResetPasswordSession: Function
    changePasswordAfter: Function
    save: Function
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please tell us your name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'please provide your email id'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'please provide a password'],
    },
    confirmPassword: {
        type: String,
        required: [true, 'please confirm your password'],
        validate: {
            validator: function (this: UserInterface, confirmPassword: string) {
                return confirmPassword === this.password
            },
            message: 'passwords are not same',
        },
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    passwordCreatedAt: {
        type: Date,
        default: Date.now(),
    },
    image: {
        type: String,
        default: 'default-user-image',
    },
    active: {
        type: Boolean,
        default: true,
    },
    address: String,
    telephone: String,
    passwordResetToken: String,
    passwordResetSessionExpiresIn: Date,
})

userSchema.pre('save', async function (this: UserInterface, next: Function) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined
    this.passwordCreatedAt = Date.now()
})

userSchema.pre(/^find/, function (this: any) {
    this.find({ active: { $ne: false } })
})

userSchema.methods.verifyPassword = async function (
    this: UserInterface,
    candidatePassword: string
) {
    return await bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.changePasswordAfter = function (
    this: UserInterface,
    timeStamp: number
) {
    return timeStamp * 1000 < this.passwordCreatedAt
}

userSchema.methods.createResetPasswordSession = async function (
    this: UserInterface
): Promise<string> {
    const resetToken = await crypto
        .createHash('sha256')
        .update(`${Math.random()}`)
        .digest('hex')

    this.passwordResetToken = resetToken
    this.passwordResetSessionExpiresIn = Date.now() + 5 * 60 * 1000
    this.save({ validateBeforeSave: false })

    return resetToken
}

const User = mongoose.model<UserInterface>('User', userSchema)
export default User
