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

  it('should set a macro', function() {
    var expected = {
      action: 'set',
      orig: ['--macro', 'foo', 'foo', 'bar', 'baz'],
      argv: ['--macro', 'foo', 'foo', 'bar', 'baz'],
      args: {_: ['foo', 'bar', 'baz'], macro: 'foo'}
    };

    var res = parser(['--macro', 'foo', 'foo', 'bar', 'baz']);
    assert.deepEqual(res, expected);
    assert.deepEqual(store.get(['macro', 'foo']), ['foo', 'bar', 'baz']);
  });

  it('should get macros from the store', function() {
    var expected = {
      action: 'get',
      orig: ['foo'],
      argv: ['foo', 'bar', 'baz'],
      args: {_: ['foo']}
    };

    parser(['--macro', 'foo', 'foo', 'bar', 'baz']);
    assert.deepEqual(parser('foo'), expected);
  });

  it('should return original name when macro is not set in the store', function() {
    var expected = {
      action: 'get',
      orig: ['foo'],
      argv: ['foo'],
      args: {_: ['foo']}
    };

    assert.deepEqual(parser('foo'), expected);
  });

  it('should not process macros when `--no-macro` is set', function() {
    var expected = {
      action: 'none',
      orig: ['foo', '--no-macro'],
      argv: ['foo', '--no-macro'],
      args: {_: ['foo'], macro: false}
    };

    assert.deepEqual(parser(['foo', '--no-macro']), expected);
  });

  it('should del macros from the store', function() {
    var expected = {
      action: 'get',
      orig: ['foo'],
      argv: ['foo', 'bar', 'baz'],
      args: { _: ['foo'] }
    };

    parser(['--macro', 'foo', 'foo', 'bar', 'baz']);
    assert.deepEqual(parser('foo'), expected);

    expected = {
      action: 'get',
      orig: ['foo'],
      argv: ['foo'],
      args: {_: ['foo']}
    };

    parser(['--macro', '--del', 'foo']);
    assert.deepEqual(parser('foo'), expected);
  });

  it('should delete all macros when no macro is specified for `--del`', function() {
    parser(['--macro', 'foo', 'foo', 'bar', 'baz']);
    parser(['--macro', 'qux', 'beep', 'boop', 'bop']);
    var expected = {
      action: 'get',
      orig: ['foo'],
      argv: ['foo', 'bar', 'baz'],
      args: {_: ['foo']}
    };
    assert.deepEqual(parser('foo'), expected);

    expected = {
      action: 'get',
      orig: ['qux'],
      argv: ['beep', 'boop', 'bop'],
      args: {_: ['qux']}
    };
    assert.deepEqual(parser('qux'), expected);

    expected = {
      action: 'get',
      orig: ['foo', 'qux'],
      argv: ['foo', 'qux'],
      args: {_: ['foo', 'qux']}
    };

    parser(['--macro', '--del']);
    assert.deepEqual(parser(['foo', 'qux']), expected);
  });
});
