// MemoryStore is an in-memory key/store with the localStorage interface
class MemoryStore {
  constructor () {
    this.data = {}
  }

  getItem (key) {
    return this.data[key]
  }

  setItem (key, value) {
    this.data[key] = value
  }
}

module.exports = MemoryStore
