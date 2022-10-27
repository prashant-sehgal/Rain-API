import Product from '../models/productModel'
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from '../utils/RESTHandler'

export const getAllProducts = getAll(Product)

export const createNewProduct = createOne(Product)

export const getProduct = getOne(Product)

export const updateProduct = updateOne(Product)

export const deleteProduct = deleteOne(Product)
