'use strict';

require('mocha');

var rimraf = require('rimraf');
var assert = require('assert');
var utils = require('../lib/utils');
var macros = require('../');
var store;

describe('macro-store', function() {
  beforeEach(function(cb) {
    store = new utils.Store('macros', {cwd: 'actual'});
    rimraf('actual', cb);
  });
  afterEach(rimraf.bind(rimraf, 'actual'));

  it('should export a function', function() {
    assert.equal(typeof macros, 'function');
  });

  it('should return early when nothing is in the array', function() {
    assert.deepEqual(macros([]), []);
  });

  it('should set a macro', function() {
    var args = macros(['foo', '--macro', 'foo', 'bar', 'baz'], {store: store});
    assert.deepEqual(args, []);
    assert.deepEqual(store.get(['macro', 'foo']), ['foo', 'bar', 'baz']);
  });

  it('should get macros from the store', function() {
    macros(['foo', '--macro', 'foo', 'bar', 'baz'], {store: store});
    assert.deepEqual(macros('foo', {store: store}), ['foo', 'bar', 'baz']);
  });

  it('should return original name when macro is not set in the store', function() {
    assert.deepEqual(macros('foo', {store: store}), ['foo']);
  });

  it('should del macros from the store', function() {
    macros(['foo', '--macro', 'foo', 'bar', 'baz'], {store: store});
    assert.deepEqual(macros('foo', {store: store}), ['foo', 'bar', 'baz']);

    macros(['--macro:delete', 'foo'], {store: store});
    assert.deepEqual(macros('foo', {store: store}), ['foo']);
  });

  it('should return early when `--macro:delete` is specified but no name is specified', function() {
    macros(['foo', '--macro', 'foo', 'bar', 'baz'], {store: store});
    assert.deepEqual(macros('foo', {store: store}), ['foo', 'bar', 'baz']);

    macros(['--macro:delete'], {store: store});
    assert.deepEqual(macros('foo', {store: store}), ['foo', 'bar', 'baz']);
  });
});
