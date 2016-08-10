'use strict';

require('mocha');

var os = require('os');
var path = require('path');
var rimraf = require('rimraf');
var assert = require('assert');
var utils = require('../lib/utils');
var macros = require('../');
var store;

describe('macro-store', function() {
  it('should export a function', function() {
    assert.equal(typeof macros, 'function');
  });
});
