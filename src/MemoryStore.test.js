import test from 'ava'
import MemoryStore from './MemoryStore'

test('MemoryStore requires new()', t => {
  t.throws(() => MemoryStore())
  t.notThrows(() => new MemoryStore())
})

test('MemoryStore basic usage', t => {
  const store = new MemoryStore()
  t.is(store.getItem('foo'), undefined)
  store.setItem('foo', 'bar')
  t.is(store.getItem('foo'), 'bar')
})
