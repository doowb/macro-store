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
 * Initialize a new `Macro` with the given `options`.
 *
 * ```js
 * var macros = new Macros();
 * //=> '~/data-store/macros.json'
 *
 * var macros = new Macros({name: 'abc'});
 * //=> '~/data-store/abc.json'
 * ```
 *
 * @param  {Object} `options`
 * @param {String} `options.name` Name of the json file to use for storing macros. Defaults to 'macros'
 * @param {Object} `options.store` Instance of [data-store][] to use. Allows complete control over where the store is located.
 * @api public
 */

function MacroStore(options) {
  if (!(this instanceof MacroStore)) {
    return new MacroStore(options);
  }

  options = options || {};
  var name = options.name || 'macros';
  this.store = options.store || new utils.Store(name);
}

/**
 * Check if an argv array contains the --macro option as the second item
 * in the array.
 *
 * ```js
 * macros.has(['foo', '--macro']);
 * //=> true
 *
 * macros.has(['foo']);
 * //=> false
 * ```
 *
 * @param  {Array} `argv` Array of arguments from process.argv
 * @return {Boolean} If the array contains '--macro' in the second item.
 * @api public
 */

MacroStore.prototype.has = function(argv) {
  debug('macro-store.has', argv);
  return argv.indexOf('--macro') === 1;
};

/**
 * Set a macro in the store from the given argv array.
 *
 * ```js
 * macros.set(['foo', '--macro', 'foo', 'bar', 'baz']);
 * ```
 *
 * @param {Array} `argv` process.argv array.
 * @returns {Object} `this` for chaining
 * @api public
 */

MacroStore.prototype.set = function(argv) {
  debug('macro-store.set', argv);
  this.store.set(['macro', argv[0]], argv.slice(2));
  return this;
};

/**
 * Get a macro from the store.
 *
 * ```js
 * var tasks = macros.get('foo');
 * //=> ['foo', 'bar', 'baz']
 *
 * // returns input name when macro is not in the store
 * var tasks = macros.get('bar');
 * //=> 'bar'
 * ```
 * @param  {String} `name` Name of macro to get.
 * @return {String|Array} Array of tasks to get from a stored macro, or the original name when a stored macro does not exist.
 * @api public
 */

MacroStore.prototype.get = function(name) {
  debug('macro-store.get', name);
  var macro = utils.arrayify(this.store.get(['macro', name]));
  return macro.length ? macro : name;
};

/**
 * Remove a macro from the store.
 *
 * ```js
 * macros.del('foo');
 * ```
 * @param  {String} `name` Name of macro to remove.
 * @return {Object} `this` for chaining
 * @api public
 */

MacroStore.prototype.del = function(name) {
  debug('macro-store.del', name);
  this.store.del(['macro', name]);
  return this;
};

/**
 * Expose `MacroStore`
 */

module.exports = MacroStore;
