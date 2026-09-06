import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProducts, sortProducts } from '../src/utils/productFilters.js';
import { generateOrderId } from '../src/utils/generateOrderId.js';

const products = [
  { id: '1', name: 'Blue Flame Tee', category: 'tees', price: 48, sizes: ['S', 'M'], colors: ['Blue'], stock: 10, featured: true, createdAt: '2026-08-02' },
  { id: '2', name: 'Void Hoodie', category: 'hoodies', price: 90, sizes: ['L'], colors: ['Black'], stock: 0, featured: false, createdAt: '2026-08-31' },
];

test('filterProducts combines search, category and availability', () => {
  const result = filterProducts(products, { search: 'flame', categories: ['tees'], sizes: [], colors: [], inStockOnly: true, maxPrice: 100 });
  assert.deepEqual(result.map((p) => p.id), ['1']);
});

test('sortProducts supports price descending without mutating input', () => {
  const copy = [...products];
  const result = sortProducts(products, 'price-desc');
  assert.deepEqual(result.map((p) => p.id), ['2', '1']);
  assert.deepEqual(products, copy);
});

test('generateOrderId uses the ZNJ prefix', () => {
  const id = generateOrderId(new Date('2026-09-02T06:00:00Z'), () => 0.1234);
  assert.match(id, /^ZNJ-260902-\d{4}$/);
});
