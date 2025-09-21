import { StatusCodes } from "http-status-codes"
import { body } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { User } from '#models/user.js'
import { Controller } from "#controllers/rest/controller.js"

export class RestAuthController extends Controller {
  userService = null
  jwtToken = null

  constructor(userService) {
    super()
    this.userService = userService
    this.jwtToken = process.env.API_JWT_SECRET || 'token-exemplo'
  }

  validateRegister = [
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

  validateLogin = [
    // Valida o campo 'email'
    body('email')
      .notEmpty().withMessage('The field email is required')
      .isEmail().withMessage('The field email is invalid'),

    // Valida o campo 'password'
    body('password')
      .notEmpty().withMessage('The field password is required'),

    // Lida com os erros de validação
    this.handleValidationErrors
  ]

  async register(req, res) {
    const { name, email, password, phone } = req.body

    // Verifica se o usuário já existe com o mesmo email
    const existingUser = this.userService.findByEmail(email)
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        error: 'The email already exists'
      })
    }

    try {
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      let newUser = new User()
      newUser.name = name
      newUser.email = email
      newUser.phone = phone
      newUser.password = hashedPassword
      const user = this.userService.create(newUser)

      res.status(StatusCodes.CREATED).json({ 
        message: 'User registered successfully!',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        }
      })
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Erro user registered',
        message: error.message
      })
    }
  }

  async login(req, res) {
    const { email, password } = req.body

    const user = this.userService.findByEmail(email)
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Incorrect email or password' })
    }

    try {
      const passwordMatch = await bcrypt.compare(password, user.password)
      if (!passwordMatch) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Incorrect email or password' })
      }

      // Cria um token JWT
      const token = jwt.sign({ 
        email: user.email,
        name: user.name,
        phone: user.phone
      }, this.jwtToken, { expiresIn: '1h' })

      res.status(StatusCodes.OK).json({ 
        message: 'Login successful', 
        token 
      })
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Error login',
        message: error.message
      })
    }
  }
}
