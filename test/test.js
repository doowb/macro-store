'use strict';

require('mocha');

var rimraf = require('rimraf');
var assert = require('assert');
var utils = require('../lib/utils');
var macros = require('../');
var parser;
var store;

describe('macro-store', function() {
  beforeEach(function(cb) {
    store = new utils.Store('macros', {cwd: 'actual'});
    parser = macros({store: store});
    rimraf('actual', cb);
  });
  afterEach(rimraf.bind(rimraf, 'actual'));

  it('should export a function', function() {
    assert.equal(typeof macros, 'function');
  });

  it('should return a parser function when called', function() {
    assert.equal(typeof macros('custom-macros-store'), 'function');
  });

  it('should set a macro using `--macro`', function() {
    var res = parser(['--macro', 'foo', 'foo', 'bar', 'baz']);
    assert.deepEqual(res, { _: ['foo', 'bar', 'baz'], macro: 'foo' });
    assert.deepEqual(store.get(['macro', 'foo']), ['foo', 'bar', 'baz']);
  });

  it('should set a macro using `--macro set`', function() {
    var res = parser(['--macro', 'set', 'foo', 'foo', 'bar', 'baz']);
    assert.deepEqual(res, { _: ['foo', 'foo', 'bar', 'baz'], macro: 'set' });
    assert.deepEqual(store.get(['macro', 'foo']), ['foo', 'bar', 'baz']);
  });

  it('should set a macro using `--macro=set`', function() {
    var res = parser(['--macro=set', 'foo', 'foo', 'bar', 'baz']);
    assert.deepEqual(res, { _: ['foo', 'foo', 'bar', 'baz'], macro: 'set' });
    assert.deepEqual(store.get(['macro', 'foo']), ['foo', 'bar', 'baz']);
  });

  it('should get macros from the store', function() {
    parser(['--macro', 'foo', 'foo', 'bar', 'baz']);
    assert.deepEqual(parser('foo'), { _: ['foo', 'bar', 'baz'], isMacro: 'foo' });
  });

  it('should get a complex macro from the store', function() {
    parser(['--macro', 'foo', 'foo', 'bar', 'baz', '--verbose', '--cwd', 'docs']);
    assert.deepEqual(parser('foo'), { _: ['foo', 'bar', 'baz'], verbose: true, cwd: 'docs', isMacro: 'foo' });
  });

  it('should return original name when macro is not set in the store', function() {
    assert.deepEqual(parser('foo'), { _: ['foo'] });
  });

  it('should not process macros when `--no-macro` is set', function() {
    assert.deepEqual(parser(['foo', '--no-macro']), { _: ['foo'], macro: false });
  });

  it('should del macros from the store', function() {
    parser(['--macro', 'foo', 'foo', 'bar', 'baz']);
    assert.deepEqual(parser('foo'), { _: ['foo', 'bar', 'baz'], isMacro: 'foo' });

    parser(['--macro', 'del', 'foo']);
    assert.deepEqual(parser('foo'), { _: ['foo'] });
  });

  it('should delete all macros when no macro is specified for `--del`', function() {
    parser(['--macro', 'foo', 'foo', 'bar', 'baz']);
    parser(['--macro', 'qux', 'beep', 'boop', 'bop']);
    assert.deepEqual(parser('foo'), { _: ['foo', 'bar', 'baz'], isMacro: 'foo' });
    assert.deepEqual(parser('qux'), { _: ['beep', 'boop', 'bop'], isMacro: 'qux' });

    parser(['--macro', 'del']);
    assert.deepEqual(parser(['foo', 'qux']), { _: ['foo', 'qux'] });
  });
});
