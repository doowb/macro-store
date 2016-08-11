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
 *
 * Set macros by specifying using the `--macro` option and a list of values.
 *
 * Remove a macro by specifying `--macro` and `--del` options.
 *
 * Default is to replace values in the `argv` array with stored macro values (if found).
 *
 * ```js
 * // create an argv parser
 * var parser = macros('custom-macro-store');
 *
 * // get arguments from the command line input
 * var argv = process.argv.slice(2);
 *
 * // parse the input
 * var res = parser(argv);
 * // =>  {
 * // =>    action: 'get', // ['none', 'set', 'get', 'del'],
 * // =>    orig: ['foo'], // original argv array
 * // =>    argv: ['bar'], // updated argv array (if get action)
 * // =>    args: { _: ['foo'] } // parsed args from the specified parser.
 * // =>  }
 *
 * // following input will produce the following results:
 * //
 * // Set 'foo' as ['bar', 'baz', 'bang']
 * // $ app --macro foo bar baz bang
 * // =>  {
 * // =>    action: 'set',
 * // =>    orig: ['--macro', 'foo', 'bar', 'baz', 'bang'],
 * // =>    argv: ['--macro', 'foo', 'bar', 'baz', 'bang'],
 * // =>    args: { _: ['bar', 'baz', 'bang'], macro: 'foo' }
 * // =>  }
 * //
 * // Use 'foo'
 * // $ app foo
 * // =>  {
 * // =>    action: 'get',
 * // =>    orig: ['foo'],
 * // =>    argv: ['bar', 'baz', 'bang'],
 * // =>    args: { _: ['foo'] }
 * // =>  }
 * //
 * // Remove the 'foo' macro
 * // $ app --macro --del foo
 * // =>  {
 * // =>    action: 'del',
 * // =>    orig: ['--macro', '--del', 'foo'],
 * // =>    argv: ['--macro', '--del', 'foo'],
 * // =>    args: { _: [], macro: true, del: 'foo' }
 * // =>  }
 * ```
 *
 * @param  {String} `name` Custom name of the [data-store][] to use. Defaults to 'macros'.
 * @param  {Object} `options` Options to pass to the store to control the name or instance of the [date-store][]
 * @param  {String} `options.name` Name of the [data-store][] to use for storing macros. Defaults to `macros`
 * @param  {Object} `options.store` Instance of [data-store][] to use. Defaults to `new DataStore(options.name)`
 * @param  {Function} `options.parser` Custom argv parser to use. Defaults to [yargs-parser][]
 * @return {Function} argv parser to process macros
 * @api public
 */

module.exports = function macros(name, config) {
  if (typeof name === 'object') {
    config = name;
    name = null;
  }

  var opts = utils.extend({}, config);
  opts.name = name || opts.name;

  var store = new Store(opts);
  var parse = opts.parser || utils.parser;

  /**
   * Parser function used to parse the argv array and process macros.
   *
   * @name parser
   * @param  {Array} `argv` Array of arguments to process
   * @param  {Object} `options` Additional options to pass to the argv parser
   * @return {Object} Results object [described above](#macros)
   * @api public
   */

  return function parser(argv, options) {
    argv = utils.arrayify(argv);
    var res = {
      action: 'none',
      orig: argv.slice(),
      argv: argv.slice(),
      args: parse(argv, utils.extend({}, options))
    };

    if (res.args.macro === false) {
      return res;
    }

    // $ app --macro
    // $ app --macro=foo
    // $ app --macro foo
    if (res.args.macro) {

      // $ app --macro --del
      // $ app --macro --del=foo
      // $ app --macro --del foo
      if (res.args.del) {
        res.action = 'del';
        store.del(res.args.del === true ? res.args._ : [res.args.del].concat(res.args._));
        return res;
      }

      // $ app --macro=foo bar baz bang
      // $ app --macro foo bar baz bang
      res.action = 'set';
      store.set(res.args.macro, res.args._);
      return res;
    }

    var arr = [];
    res.action = 'get';
    res.args._.forEach(function(arg) {
      var val = store.get(arg);
      arr = arr.concat(val);
    });

    res.argv = arr.slice();
    return res;
  };
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
