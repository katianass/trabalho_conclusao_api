import { StatusCodes } from "http-status-codes"
import { body } from 'express-validator'

import { Controller } from "#controllers/rest/controller.js"
import { Product } from "#models/product.js"

export class RestProductController extends Controller {
  constructor(productService) {
    super()
    this.productService = productService
  }

  validateCreate = [
      // Valida o campo 'name'
      body('name')
        .notEmpty().withMessage('The field name is required'),
  
      // Valida o campo 'price'
      body('price')
        .notEmpty().withMessage('The field price is required'),
  
      // Valida o campo 'description'
      body('description')
        .notEmpty().withMessage('The field description is required'),
  
      // Lida com os erros de validação
      this.handleValidationErrors
    ]

  create(req, res) {
    try {
      let productNew = new Product()
      productNew.name = req.body.name
      productNew.price = req.body.price
      productNew.description = req.body.description

      const product = this.productService.create(productNew)
      res.status(StatusCodes.CREATED).json({
        message : 'Product created',
        data: product
      })
    } catch (err) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: err.message })
    }

  }

  list(req, res) {
    res.json(this.productService.findAll())
  }

  delete(req, res) {
    try {
      const productId = parseInt(req.params.id)
      const product = this.productService.findById(productId)
      if (!product) return res.status(StatusCodes.NOT_FOUND).json({ error: "Product not found" })

      this.productService.delete(productId)
      res.status(StatusCodes.NO_CONTENT).json({ message: "Product removed" })
    } catch (err) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: err.message })
    }
  }

  find(req, res) {
    const productId = parseInt(req.params.id)
    const product = this.productService.findById(productId)
    if (!product) return res.status(StatusCodes.NOT_FOUND).json({ error: "Product not found" })
    res.json(product)
  }

  update(req, res) {
    try {
      const productId = parseInt(req.params.id)
      const productExist = this.productService.findById(productId)
      if (!productExist) return res.status(StatusCodes.NOT_FOUND).json({ error: "Product not found" })

      let productUpdate = new Product()
      productUpdate.name = req.body.name
      productUpdate.price = req.body.price
      productUpdate.description = req.body.description

      const product = this.productService.update(productId, productUpdate)
      res.json(product)
    } catch (err) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: err.message })
    }
  }
}
