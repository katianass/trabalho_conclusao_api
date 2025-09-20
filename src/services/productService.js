import { ProductModel } from '#models/productModel.js'

export class ProductService {
    constructor(productModel) {
        this.productModel = productModel
    }

    create(product) {
        return this.productModel.create(product)
    }

    findAll() {
        return this.productModel.findAll()
    }

    findById(productId) {
        const product = this.productModel.findById(productId)
        if (product) {
            return {
                ... product,
                id: productId,
            }
        }
        return null
    }

    delete(productId) {
        return this.productModel.delete(productId)
    }

    update(productId, product) {
        return this.productModel.update(productId, product)
    }
}