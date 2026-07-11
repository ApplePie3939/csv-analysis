'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync('js/csv-analyzer.js', 'utf8');
const element = {
  addEventListener() {},
  appendChild() {},
  classList: { add() {}, remove() {} },
  style: {}
};
const context = {
  alert() {},
  document: {
    createElement: () => ({ ...element }),
    getElementById: () => ({ ...element }),
    querySelectorAll: () => []
  },
  FileReader: function FileReader() {}
};

vm.createContext(context);
vm.runInContext(source, context);

const parse = (value, limits) => context.parseCSVRows(value, limits);
const limits = overrides => ({
  maxRows: 10,
  maxColumns: 10,
  maxCells: 100,
  maxCellLength: 100,
  ...overrides
});

test('quoted commas, escaped quotes, and embedded newlines are parsed', () => {
  assert.deepEqual(
    JSON.parse(JSON.stringify(parse('a,b\n"x,y","x""y"\n"x\ny",z', limits()))),
    [['a', 'b'], ['x,y', 'x"y'], ['x\ny', 'z']]
  );
});

test('rejects input beyond the row limit while parsing', () => {
  assert.throws(() => parse('a\nb\nc', limits({ maxRows: 2 })), /行数/);
});

test('accepts input exactly at all configured limits', () => {
  assert.deepEqual(
    JSON.parse(JSON.stringify(parse('ab,c\nde,f', limits({
      maxRows: 2,
      maxColumns: 2,
      maxCells: 4,
      maxCellLength: 2
    })))),
    [['ab', 'c'], ['de', 'f']]
  );
});

test('rejects input beyond the column limit', () => {
  assert.throws(() => parse('a,b,c', limits({ maxColumns: 2 })), /列数/);
});

test('rejects input beyond the total cell limit', () => {
  assert.throws(() => parse('a,b\nc,d', limits({ maxCells: 3 })), /セル数/);
});

test('rejects an oversized cell, including escaped quote content', () => {
  assert.throws(() => parse('abcd', limits({ maxCellLength: 3 })), /セルが長すぎます/);
  assert.throws(() => parse('"a""b"', limits({ maxCellLength: 2 })), /セルが長すぎます/);
});

test('Cloudflare Pages headers enforce browser security controls', () => {
  const headers = fs.readFileSync('_headers', 'utf8');
  assert.match(headers, /Content-Security-Policy:.*frame-ancestors 'none'/);
  assert.match(headers, /Content-Security-Policy:.*base-uri 'none'/);
  assert.match(headers, /X-Frame-Options: DENY/);
  assert.match(headers, /Strict-Transport-Security:/);
});
