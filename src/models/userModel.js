import { Model } from "#models/model.js"
import { User } from "#models/user.js"

export class UserModel extends Model {
  constructor() {
    super()
  }

  findByEmail(email) {
    const filteredUser = new Map()
    let keyMap = null

    this.data.forEach((user, key) => {
      if (user.email === email) {
        filteredUser.set(key, user)
        keyMap = key
      }
    })

    if (filteredUser.size > 0) {
      const userExist = filteredUser.get(keyMap)
      let user = new User()
      user.id = keyMap
      user.name = userExist.name
      user.email = userExist.email
      user.phone = userExist.phone
      user.password = userExist.password

      return user
    }
    return null
  }

  findAll() {
    return Array.from(this.data.entries()).map((dataArray) => {
      const id = dataArray[0]
      const { name, email, phone } = dataArray[1]

      return {
        name,
        email,
        phone, 
        id,
      }
    })
  }
}
