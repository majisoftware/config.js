import test from 'ava'
import Store from './Store'

test('Store#isEmpty()', t => {
  const store = new Store({ key: 'test' })
  t.is(store.isEmpty(), true)
  store.set('foo', 'bar')
  t.is(store.isEmpty(), false)
})

test('Store#get(key)', t => {
  const store = new Store({ key: 'test' })
  t.is(store.get('foo'), undefined)
  store.set('foo', 'bar')
  t.is(store.get('foo'), 'bar')
})

test('Store#set(key, value)', t => {
  const store = new Store({ key: 'test' })
  store.set('foo', 'bar')
  store.set('baz', 'qux')
  t.deepEqual(store.getAll(), {
    foo: 'bar',
    baz: 'qux'
  })
})

test('Store#delete(key)', t => {
  const store = new Store({ key: 'test' })
  store.set('foo', 'bar')
  store.set('baz', 'qux')
  store.delete('foo')
  t.deepEqual(store.getAll(), {
    baz: 'qux'
  })
})
