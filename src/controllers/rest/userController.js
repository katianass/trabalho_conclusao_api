import { StatusCodes } from "http-status-codes"
import { body } from 'express-validator'
import bcrypt from 'bcrypt'

import { User } from "#models/user.js"
import { Controller } from "#controllers/rest/controller.js"

export class RestUserController extends Controller {
  constructor(userService) {
    super()
    this.userService = userService
  }

  validateCreate = [
    // Valida o campo 'name'
    body('name')
      .notEmpty().withMessage('The field name is required'),

    // Valida o campo 'email'
    body('email')
      .notEmpty().withMessage('The field email is required')
      .isEmail().withMessage('The field email is invalid'),

    // Valida o campo 'password'
    body('password')
      .notEmpty().withMessage('The field password is required'),

    // Valida o campo 'phone'
    body('phone')
      .notEmpty().withMessage('The field phone is required'),

    // Lida com os erros de validação
    this.handleValidationErrors
  ]

  async create(req, res) {
    try {

      const { name, email, password, phone } = req.body

      // Verifica se o usuário já existe com o mesmo email
      const existingUser = this.userService.findByEmail(email)
      if (existingUser) {
        return res.status(StatusCodes.CONFLICT).json({
          error: 'The email already exists'
        })
      }

      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      let userNew = new User()
      userNew.name = name
      userNew.email = email
      userNew.phone = phone
      userNew.password = hashedPassword

      const user = this.userService.create(userNew)
      res.status(StatusCodes.CREATED).json({
        message : 'User created',
        data: user
      })
    } catch (err) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: err.message })
    }
  }

  list(req, res) {
    res.json(this.userService.findAll())
  }

  delete(req, res) {
    try {
      const userId = parseInt(req.params.id)
      const user = this.userService.findById(userId)
      if (!user) return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" })

      this.userService.delete(userId)
      res.status(StatusCodes.NO_CONTENT).json({ message: "User removed" })
    } catch (err) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: err.message })
    }
  }

  find(req, res) {
    const userId = parseInt(req.params.id)
    const user = this.userService.findById(userId)
    if (!user) return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" })
    res.json(user)
  }

  async update(req, res) {
    // TODO validar campos de entrada

    try {
      const userId = parseInt(req.params.id)
      const userExist = this.userService.findById(userId)
      if (!userExist) return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" })

      const { name, email, password, phone } = req.body

      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      let userUpdate = new User()
      userUpdate.name = name
      userUpdate.email = email
      userUpdate.phone = phone
      userUpdate.password = hashedPassword

      this.userService.update(userId, userUpdate)
      res.status(StatusCodes.OK).json({
        message : 'User update successful'
      })
    } catch (err) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: err.message })
    }
  }
}
