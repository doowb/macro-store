/*!
 * macro-store (https://github.com/doowb/macro-store)
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./lib/utils');
var Store = require('./lib/store');

/**
 * Handle macro processing and storing for an array of arguments.
 * Set macros by specifying the macro name as the first argument, `--macro` as the second argument, and the macro value as the rest of the arguments
 * Remove a macro by specifying `--macro:delete` as the first argument and the macro name as the second argument
 * Default is to replace values in the array with stored macro values (if found)
 *
 * ```js
 * // get arguments from the command line input
 * var argv = process.argv.slice(2);
 *
 * // process the input using a custom store name (specified on options)
 * args = macros(argv, { name: 'custom-macro-store' });
 *
 * // following input will produce the following args:
 * //
 * // Set 'foo' as ['bar', 'baz', 'bang']
 * // $ app foo --macro bar baz bang
 * //
 * // Nothing is returned
 * // => []
 * //
 * // Use 'foo'
 * // $ app foo
 * // => ['bar', 'baz', 'bang']
 * //
 * // Remove the 'foo' macro
 * // $ app --macro:delete foo
 * // => []
 * ```
 *
 * @param  {Array} `argv` Array of arguments to process
 * @param  {Object} `options` Options to pass to the store to control the name or instance of the [date-store][]
 * @param  {String} `options.name` Name of the [data-store][] to use for storing macros. Defaults to `macros`
 * @param  {Object} `options.store` Instance of [data-store][] to use. Defaults to `new DataStore(options.name)`
 * @return {Array} Resulting array of arguments after processing the initial argv.
 * @api public
 */

module.exports = function macros(argv, options) {
  argv = utils.arrayify(argv);
  if (!argv.length) {
    return [];
  }

  var opts = utils.extend({}, options);
  var store = new Store(opts);

  var orig = argv.slice();
  if (store.has(argv)) {
    store.set(argv);
    return [];
  } else if (store.hasDelete(argv)) {
    if (argv[1]) {
      store.del(argv[1]);
    }
    return [];
  } else {
    var res = [];
    argv.forEach(function(arg) {
      var val = store.get(arg);
      res = res.concat(val);
    });
    argv = res.slice();
  }
  return argv;
};

/**
 * Exposes `Store` for low level access
 *
 * ```js
 * var store = new macros.Store({name: 'custom-macro-store'});
 * ```
 * @name Store
 * @api public
 */

module.exports.Store = Store;
