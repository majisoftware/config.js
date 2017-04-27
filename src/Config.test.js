import test from 'ava'
import nock from 'nock'
import delay from 'delay'
import Config from './Config'

const MOCK_HOST = 'https://api.config.maji.cloud'
const ABSURDLY_LONG_WAIT = 1000000

let consoleError

test.before(() => {
  consoleError = global.console.error
})

test.afterEach.always(() => {
  global.console.error = consoleError
})

test('Config(): requires API key', t => {
  t.throws(() => new Config())
})

test('Config() custom storageKey', t => {
  const c = new Config({ apiKey: 'XXX', storageKey: 'custom' })
  t.is(c.store.key, 'custom')
})

test('Config#get(key) requires prepare()', t => {
  const c = new Config({ apiKey: 'XXX' })
  t.throws(() => c.get('foo'))
})

test('Config#getAll() makes request with apiKey', async t => {
  const API_KEY = 'banananana'
  const expectedHeaders = { authorization: `bearer ${API_KEY}` }
  const scope = nock(MOCK_HOST, { reqheaders: expectedHeaders })
    .get('/getConfig')
    .reply(200, '{"foo":"bar"}')

  const c = new Config({ apiKey: API_KEY, host: MOCK_HOST })
  const res = await c.getAll()
  t.deepEqual(res, { foo: 'bar' })

  t.truthy(scope.isDone())
})

test('Config#getAll() 4xx response', async t => {
  const scope = nock(MOCK_HOST)
    .get('/getConfig')
    .reply(403)

  const c = new Config({ apiKey: 'XXX', host: MOCK_HOST })
  const error = await t.throws(c.getAll())
  t.is(error.message, 'MajiConfig: request error (403)')

  t.truthy(scope.isDone())
})

test('Config#prepare() is ready', async t => {
  const c = new Config({ apiKey: 'XXX' })
  c.isReady = true
  await c.prepare()
  t.pass()
})

test('Config#prepare() starts polling', async t => {
  const scope = nock(MOCK_HOST).get('/getConfig').reply(200, '{"foo":"bar"}')
  const c = new Config({ apiKey: 'XXX', host: MOCK_HOST, wait: ABSURDLY_LONG_WAIT })
  t.is(c.timeout, -1)
  await c.prepare()
  t.not(c.timeout, -1)
  clearTimeout(c.timeout)
  t.truthy(scope.isDone())
})

test('Config#prepare() with non-empty store', async t => {
  const c = new Config({ apiKey: 'XXX', wait: ABSURDLY_LONG_WAIT })
  c.store.set('foo', 'bar')

  await c.prepare()

  t.is(c.isReady, true)
})

test('Config#prepare() error', async t => {
  const scope = nock(MOCK_HOST).get('/getConfig').reply(403)
  const c = new Config({ apiKey: 'XXX', host: MOCK_HOST, wait: ABSURDLY_LONG_WAIT })
  const error = await t.throws(c.prepare())
  t.truthy(error)
  t.truthy(scope.isDone())
})

test('Config#poll()', async t => {
  const scope = nock(MOCK_HOST).get('/getConfig').reply(200, '{"foo":"bar"}')
  const c = new Config({ apiKey: 'XXX', host: MOCK_HOST, wait: ABSURDLY_LONG_WAIT })
  await c.poll()
  t.truthy(scope.isDone())
  clearTimeout(c.timeout)
})

test('Config#defaultErrorHandler(err)', t => {
  const c = new Config({ apiKey: 'XXX' })
  global.console.error = () => {}
  c.defaultErrorHandler(new Error('oh no!'))
  t.pass()
})

test('Config#onRecieveConfig(config)', t => {
  const c = new Config({ apiKey: 'XXX' })
  c.isReady = true
  c.store.set('foo', 'bar')
  c.store.set('baz', 'qux')
  c.onRecieveConfig({ foo: 'bar', dog: '🐶' })
  t.is(c.get('baz'), undefined)
  t.is(c.get('foo'), 'bar')
  t.is(c.get('dog'), '🐶')
})

test.cb('Config#onRecieveConfig(config) emits "change" events', t => {
  const c = new Config({ apiKey: 'XXX' })
  c.store.set('foo', 'bar')

  c.on('change', (key, value) => {
    t.is(key, 'foo')
    t.is(value, '🐶')
    t.end()
  })

  c.onRecieveConfig({ foo: '🐶' })
})

test.cb('Config#onRecieveConfig(config) emits "delete" events', t => {
  const c = new Config({ apiKey: 'XXX' })
  c.store.set('foo', 'bar')

  c.on('delete', key => {
    t.is(key, 'foo')
    t.end()
  })

  c.onRecieveConfig({ bar: '🐶' })
})

test('Config#setNextTimeout()', async t => {
  const c = new Config({ apiKey: 'XXX', wait: 5 })
  let calledPoll = false
  c.poll = () => {
    calledPoll = true
  }
  c.setNextTimeout()
  await delay(10)
  t.truthy(calledPoll)
})
