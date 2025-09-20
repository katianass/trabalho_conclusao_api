import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ApolloError } from "apollo-server-express"

import { User } from '#models/user.js'

export class GraphQLAuthController {
  userService = null
  jwtToken = null

  constructor(userService) {
    this.userService = userService
    this.jwtToken = process.env.API_JWT_SECRET || 'token-exemplo'
  }

  async register({ name, email, password, phone }) {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    let userNew = new User()
    userNew.name = name
    userNew.email = email
    userNew.phone = phone
    userNew.password = hashedPassword

    this.userService.create(userNew)
    return 'User created'
  }

  async login({ email, password }) {
    const user = this.userService.findByEmail(email)
    if (!user) {
      throw new ApolloError("Incorrect email or password", "UNAUTHORIZED")
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw new ApolloError("Incorrect email or password", "UNAUTHORIZED")
    }

    // Cria um token JWT
    const token = jwt.sign({
      email: user.email,
      name: user.name,
      phone: user.phone
    }, this.jwtToken, { expiresIn: '1h' })

    return {
      message: 'Login successful',
      token: token
    }
  }
}
