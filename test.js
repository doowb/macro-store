'use strict';

require('mocha');
var assert = require('assert');
var macroStore = require('./');

describe('macro-store', function() {
  it('should export a function', function() {
    assert.equal(typeof macroStore, 'function');
  });

  it('should export an object', function() {
    assert(macroStore);
    assert.equal(typeof macroStore, 'object');
  });

  it('should throw an error when invalid args are passed', function(cb) {
    try {
      macroStore();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected first argument to be a string');
      assert.equal(err.message, 'expected callback to be a function');
      cb();
    }
  });
});
