import { ApolloError } from 'apollo-server-express'
import bcrypt from 'bcrypt'

import { User } from "#models/user.js"

export class GraphQLUserController {
  constructor(userService) {
    this.userService = userService
  }

  async create({ name, email, password, phone }) {
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

  findAll() {
    return this.userService.findAll()
  }

  delete(id) {
    const user = this.userService.findById(id)
    if (!user) {
      throw new ApolloError("User not found", "NOT_FOUND")
    }

    this.userService.delete(id)
    return 'User removed'
  }

  find(id) {
    const user = this.userService.findById(id)
    if (!user) {
      throw new ApolloError("User not found", "NOT_FOUND")
    }
    return user
  }

  async update({ id, name, email, password, phone }) {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    let userUpdate = new User()
    userUpdate.name = name
    userUpdate.email = email
    userUpdate.phone = phone
    userUpdate.password = hashedPassword

    this.userService.update(id, userUpdate)
    return 'User update successful'
  }
}
