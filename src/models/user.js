export class User {
  id = null
  name = null
  password = null
  email = null
  phone = null

  constructor() {
    Object.seal(this)
  }
}