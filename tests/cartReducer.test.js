import test from 'node:test';
import assert from 'node:assert/strict';
import { cartReducer, initialCartState } from '../src/reducers/cartReducer.js';

const item = { id: 'z1', name: 'Shinobi Tee', price: 48, size: 'M', color: 'Black', quantity: 1 };

test('ADD_ITEM adds a new cart line', () => {
  const state = cartReducer(initialCartState, { type: 'ADD_ITEM', payload: item });
  assert.equal(state.items.length, 1);
  assert.equal(state.items[0].quantity, 1);
});

test('ADD_ITEM merges same product variant and increments quantity', () => {
  const first = cartReducer(initialCartState, { type: 'ADD_ITEM', payload: item });
  const second = cartReducer(first, { type: 'ADD_ITEM', payload: { ...item, quantity: 2 } });
  assert.equal(second.items.length, 1);
  assert.equal(second.items[0].quantity, 3);
});

test('UPDATE_QUANTITY removes line when quantity is zero', () => {
  const first = cartReducer(initialCartState, { type: 'ADD_ITEM', payload: item });
  const second = cartReducer(first, { type: 'UPDATE_QUANTITY', payload: { key: 'z1-M-Black', quantity: 0 } });
  assert.equal(second.items.length, 0);
});
