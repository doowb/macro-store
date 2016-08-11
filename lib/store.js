/*!
 * macro-store (https://github.com/doowb/macro-store)
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('macro-store');
var utils = require('./utils');

/**
 * Initialize a new `Store` with the given `options`.
 *
 * ```js
 * var macroStore = new Store();
 * //=> '~/data-store/macros.json'
 *
 * var macroStore = new Store({name: 'abc'});
 * //=> '~/data-store/abc.json'
 * ```
 *
 * @param  {Object} `options`
 * @param {String} `options.name` Name of the json file to use for storing macros. Defaults to 'macros'
 * @param {Object} `options.store` Instance of [data-store][] to use. Allows complete control over where the store is located.
 * @api public
 */

function Store(options) {
  if (!(this instanceof Store)) {
    return new Store(options);
  }

  options = options || {};
  var name = options.name || 'macros';
  this.store = options.store || new utils.Store(name);
}

/**
 * Set a macro in the store from the given argv array.
 *
 * ```js
 * macroStore.set(['foo', '--macro', 'foo', 'bar', 'baz']);
 * ```
 *
 * @param {Array} `argv` process.argv array.
 * @returns {Object} `this` for chaining
 * @api public
 */

Store.prototype.set = function(key, argv) {
  debug('macro-store.set', key, argv);
  this.store.set(['macro', key], argv);
  return this;
};

/**
 * Get a macro from the store.
 *
 * ```js
 * var tasks = macroStore.get('foo');
 * //=> ['foo', 'bar', 'baz']
 *
 * // returns input name when macro is not in the store
 * var tasks = macroStore.get('bar');
 * //=> 'bar'
 * ```
 * @param  {String} `name` Name of macro to get.
 * @return {String|Array} Array of tasks to get from a stored macro, or the original name when a stored macro does not exist.
 * @api public
 */

Store.prototype.get = function(name) {
  debug('macro-store.get', name);
  var macro = utils.arrayify(this.store.get(['macro', name]));
  return macro.length ? macro : name;
};

/**
 * Remove a macro from the store.
 *
 * ```js
 * macroStore.del('foo');
 * ```
 * @param  {String} `name` Name of macro to remove.
 * @return {Object} `this` for chaining
 * @api public
 */

Store.prototype.del = function(name) {
  debug('macro-store.del', name);
  this.store.del(`macro.${name}`);
  return this;
};

/**
 * Expose `Store`
 */

module.exports = Store;
