'use strict';

require('mocha');

var os = require('os');
var path = require('path');
var rimraf = require('rimraf');
var assert = require('assert');
var utils = require('../lib/utils');
var MacroStore = require('../').Store;
var macros;
var store;

describe('store', function() {
  beforeEach(rimraf.bind(rimraf, 'actual'));
  afterEach(rimraf.bind(rimraf, 'actual'));

  it('should export a function', function() {
    assert.equal(typeof MacroStore, 'function');
  });

  it('should create an instance', function() {
    macros = new MacroStore();
    assert(macros, 'Expected a new instance to be created.');
  });

  it('should create an instance without using new', function() {
    macros = MacroStore();
    assert(macros, 'Expected a new instance to be created.');
  });

  it('should create an instance with defaults', function() {
    macros = new MacroStore();
    assert(macros, 'Expected a new instance to be created.');
    assert(macros.store, 'Expected a new data-store instance to be created.');
    assert.equal(macros.store.name, 'macros');
    assert.equal(macros.store.cwd, path.join(os.homedir(), '.data-store'));
    assert.equal(macros.store.path, path.join(os.homedir(), '.data-store', 'macros.json'));
  });

  it('should create an instance with a custom name', function() {
    macros = new MacroStore({name: 'test-macros'});
    assert(macros, 'Expected a new instance to be created.');
    assert(macros.store, 'Expected a new data-store instance to be created.');
    assert.equal(macros.store.name, 'test-macros');
    assert.equal(macros.store.cwd, path.join(os.homedir(), '.data-store'));
    assert.equal(macros.store.path, path.join(os.homedir(), '.data-store', 'test-macros.json'));
  });

  it('should create an instance with a custom name passed as a string', function() {
    macros = new MacroStore('test-macros');
    assert(macros, 'Expected a new instance to be created.');
    assert(macros.store, 'Expected a new data-store instance to be created.');
    assert.equal(macros.store.name, 'test-macros');
    assert.equal(macros.store.cwd, path.join(os.homedir(), '.data-store'));
    assert.equal(macros.store.path, path.join(os.homedir(), '.data-store', 'test-macros.json'));
  });

  it('should create an instance with a custom data-store', function() {
    store = new utils.Store('macros', {cwd: 'actual'});
    macros = new MacroStore({store: store});
    assert(macros, 'Expected a new instance to be created.');
    assert(macros.store, 'Expected a new data-store instance to be created.');
    assert.equal(macros.store.name, 'macros');
    assert.equal(macros.store.cwd, 'actual');
    assert.equal(macros.store.path, path.resolve('actual', 'macros.json'));
  });

  describe('set', function() {
    beforeEach(function() {
      store = new utils.Store('macros', {cwd: 'actual'});
      macros = new MacroStore({store: store});
    });

    it('should set macros on the store', function() {
      macros.set('foo', ['foo', 'bar', 'baz']);
      assert.deepEqual(macros.store.get(['macro', 'foo']), ['foo', 'bar', 'baz']);
    });
  });

  describe('get', function() {
    beforeEach(function() {
      store = new utils.Store('macros', {cwd: 'actual'});
      macros = new MacroStore({store: store});
    });

    it('should get macros from the store', function() {
      macros.set('foo', ['foo', 'bar', 'baz']);
      assert.deepEqual(macros.get('foo'), ['foo', 'bar', 'baz']);
    });

    it('should return original name when macro is not set in the store', function() {
      assert.deepEqual(macros.get('foo'), 'foo');
    });
  });

  describe('del', function() {
    beforeEach(function() {
      store = new utils.Store('macros', {cwd: 'actual'});
      macros = new MacroStore({store: store});
    });

    it('should del macros from the store', function() {
      macros.set('foo', ['foo', 'bar', 'baz']);
      assert.deepEqual(macros.get('foo'), ['foo', 'bar', 'baz']);

      macros.del('foo');
      assert.deepEqual(macros.get('foo'), 'foo');
    });
  });
});
