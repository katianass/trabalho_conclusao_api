import { UserModel } from '#models/userModel.js'

export class UserService {
    constructor(userModel) {
        this.userModel = userModel
    }

    create(user) {
        return this.userModel.create(user)
    }

    findAll() {
        return this.userModel.findAll()
    }

    findByEmail(email) {
        return this.userModel.findByEmail(email)
    }

    findById(userId) {
        const user = this.userModel.findById(userId)
        if (user) {
            return {
                id: parseInt(userId, 10),
                name: user.name,
                email: user.email,
                phone: user.phone,
            }
        }
        return null
    }

    delete(userId) {
        return this.userModel.delete(userId)
    }

    update(userId, user) {
        return this.userModel.update(userId, user)
    }
}