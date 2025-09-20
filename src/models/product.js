export class Product {
  id = null
  name = null
  price = null
  description = null

  constructor() {
    Object.seal(this)
  }
}