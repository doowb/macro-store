/*!
 * macro-store (https://github.com/doowb/macro-store)
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('macro-store');

module.exports = function(config) {
  return function(app) {
    if (this.isRegistered('macro-store')) return;

    this.define('macro-store', function() {
      debug('running macro-store');
      
    });
  };
};
