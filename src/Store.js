const debug = require('debug')('MajiConfig:store')
const MemoryStore = require('./MemoryStore')

// detect localStorage; on the server (and old browsers), this will be `false`
const hasLocalStorage = global.localStorage &&
  typeof global.localStorage.getItem === 'function' &&
  typeof global.localStorage.setItem === 'function'

// Store is a (hopefully) persistent key/value store
class Store {
  constructor ({ key, useStorageWhenPossible = true }) {
    const shouldUseLocalStorage = hasLocalStorage && useStorageWhenPossible
    debug('localStorage: %s', shouldUseLocalStorage)
    this.store = shouldUseLocalStorage ? global.localStorage : new MemoryStore()
    this.key = key
    this.hydrate()
    debug('presisted data: %j', this.data)
  }

  // isEmpty checks if the store has data
  isEmpty () {
    for (const key in this.data) {
      return false
    }
    return true
  }

  // getAll returns all stored data
  getAll () {
    return this.data
  }

  // get returns the data associated with the given `key`
  get (key) {
    const value = this.data[key]
    debug('get("%s") -> %s', key, value)
    return this.data[key]
  }

  // set sets `key` to `value`
  set (key, value) {
    this.data = Object.assign({}, this.data, { [key]: value })
    debug('set("%s", "%s")', key, value)
    this.persist()
  }

  // delete removes the value of `key`
  delete (key) {
    delete this.data[key]
    this.persist()
  }

  // persist writes the current in-memory data to the store
  persist () {
    this.store.setItem(this.key, JSON.stringify(this.data))
  }

  // hydrate sets all data from the persisted store
  hydrate () {
    const raw = this.store.getItem(this.key) || '{}'
    this.data = JSON.parse(raw)
  }
}

module.exports = Store
