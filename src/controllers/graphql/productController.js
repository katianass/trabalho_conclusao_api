import { ApolloError } from 'apollo-server-express'
import { Product } from "#models/product.js"

export class GraphQLProductController {
  constructor(productService) {
    this.productService = productService
  }

  create({ name, price, description }) {
    let productNew = new Product()
    productNew.name = name
    productNew.price = price
    productNew.description = description

    this.productService.create(productNew)
    return 'Product created'
  }

  findAll() {
    return this.productService.findAll()
  }

  delete(id) {
    const product = this.productService.findById(id)
    if (!product) {
      throw new ApolloError("Product not found", "NOT_FOUND")
    }

    this.productService.delete(id)
    return 'Product removed'
  }

  find(id) {
    const product = this.productService.findById(id)
    if (!product) {
      throw new ApolloError("Product not found", "NOT_FOUND")
    }
    return product
  }

  async update({ id, name, price, description }) {
    const product = this.productService.findById(id)
    if (!product) {
      throw new ApolloError("Product not found", "NOT_FOUND")
    }

    let productUpdate = new Product()
    productUpdate.name = name
    productUpdate.price = price
    productUpdate.description = description

    this.productService.update(id, productUpdate)
    return 'Product update successful'
  }
}
