export class Model {
  constructor() {
    this.data = new Map()
    this.currentId = 1
  }

  create(item) {
    const id = this.currentId++
    const record = { 
      ...item ,
      id, 
    }
    this.data.set(id, record)

    return record
  }

  findById(id) {
    return this.data.get(id) || null
  }

  findAll() {
    return Array.from(this.data.entries()).map((dataArray) => {
      const id = parseInt(dataArray[0], 10)
      const data = dataArray[1]

      return {
        ...data,
        id,
      }
    })
  }

  update(id, newData) {
    if (!this.data.has(id)) return null
    const updated = { ...this.data.get(id), ...newData, id }
    this.data.set(id, updated)
    return updated
  }

  delete(id) {
    return this.data.delete(id)
  }
}
