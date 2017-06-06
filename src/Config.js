const fetch = require('isomorphic-fetch')
const removeSlash = require('remove-trailing-slash')
const debug = require('debug')('MajiConfig')
const assert = require('assert')
const { EventEmitter } = require('events')
const Store = require('./Store')

class Config extends EventEmitter {
  constructor ({ apiKey, host = 'https://us-central1-config-app-f04da.cloudfunctions.net', wait = 5000, onError, storageKey = '__maji_config' }) {
    super()
    assert(apiKey, 'apiKey required')
    this.isReady = false
    this.timeout = -1
    this.apiKey = apiKey
    this.onError = onError || this.defaultErrorHandler
    this.host = removeSlash(host)
    this.wait = wait
    this.store = new Store({ key: storageKey })
  }

  // prepare ensures we have config values to return and
  // starts polling for updates
  prepare () {
    debug('preparing')
    // if we're already polling, bail out rather than whiping
    // out existing timeouts
    if (this.isReady) {
      return Promise.resolve()
    }

    clearTimeout(this.timeout)

    // start polling
    this.setNextTimeout()

    // if previous config exists, we don't need to wait for
    // the updated config, since we can return the previously
    // set values
    if (!this.store.isEmpty()) {
      debug('using persisted config')
      this.isReady = true
      return Promise.resolve()
    }

    // fetch the initial config
    return this.getAll().then(config => this.onRecieveConfig(config)).then(() => {
      debug('fetched initial config')
      this.isReady = true
    })
  }

  // defaultErrorHandler logs exceptions
  defaultErrorHandler (err) {
    console.error(err)
  }

  // poll fetches new config and updates the store
  poll () {
    debug('polling')
    return this.getAll()
    .then(config => this.onRecieveConfig(config))
    .then(() => this.setNextTimeout())
    .catch(this.onError)
  }

  // onRecieveConfig updates the store with new config values
  onRecieveConfig (config) {
    const previousConfig = this.store.getAll()

    for (const key in config) {
      const newValue = config[key]
      const previousValue = previousConfig[key]
      if (newValue !== previousValue) {
        this.store.set(key, config[key])
        this.emit('change', key, newValue)
      }
    }

    for (const key in previousConfig) {
      if (!config.hasOwnProperty(key)) {
        this.store.delete(key)
        this.emit('delete', key)
      }
    }
  }

  setNextTimeout () {
    this.timeout = setTimeout(() => this.poll(), this.wait)
  }

  // get returns the config value for `key`
  get (key) {
    if (!this.isReady) {
      throw new Error('`get()` called before `prepare()`')
    }

    const value = this.store.get(key)
    debug(`get("${key}") -> ${value}`)
    return value
  }

  // getAll fetches config values
  getAll () {
    return fetch(`${this.host}/getConfig`, {
      headers: {
        authorization: `bearer ${this.apiKey}`
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`MajiConfig: request error (${res.status})`)
      }
      return res.json()
    })
  }
}

module.exports = Config
