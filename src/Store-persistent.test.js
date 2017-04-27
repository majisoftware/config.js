import test from 'ava'
import MemoryStore from './MemoryStore'

// inject a mock localStorage
global.localStorage = new MemoryStore()
global.localStorage.setItem('persistent_test', JSON.stringify({
  foo: 'bar',
  baz: 'qux'
}))

test('Store basic usage (persistent)', t => {
  const Store = require('./Store')

  const store = new Store({ key: 'persistent_test' })
  t.is(store.get('foo'), 'bar')
  t.is(store.get('baz'), 'qux')
  store.set('dog', '🐶')
  t.deepEqual(store.getAll(), {
    foo: 'bar',
    baz: 'qux',
    dog: '🐶'
  })

  const store2 = new Store({ key: 'persistent_test' })
  t.deepEqual(store2.getAll(), {
    foo: 'bar',
    baz: 'qux',
    dog: '🐶'
  })
})

test('Store basic usage (persistent)', t => {
  const Store = require('./Store')

  const store = new Store({ key: 'foo', useStorageWhenPossible: false })
  store.set('dog', '🐶')

  const store2 = new Store({ key: 'foo', useStorageWhenPossible: false })
  t.is(store2.get('dog'), undefined)
})
