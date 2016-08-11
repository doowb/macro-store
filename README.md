# macro-store [![NPM version](https://img.shields.io/npm/v/macro-store.svg?style=flat)](https://www.npmjs.com/package/macro-store) [![NPM downloads](https://img.shields.io/npm/dm/macro-store.svg?style=flat)](https://npmjs.org/package/macro-store) [![Build Status](https://img.shields.io/travis/doowb/macro-store.svg?style=flat)](https://travis-ci.org/doowb/macro-store)

Get and set macros created by commandline arguments.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save macro-store
```

## Usage

```js
var macros = require('macro-store');
```

## CLI examples

The following examples are using the [example file][example.js] run at the command line with `node example.js`.
The objects returned may be used in implementing applications however they choose.

### Setting and getting a macro

![image](https://cloud.githubusercontent.com/assets/995160/17576116/6b11e06e-5f3d-11e6-8019-6ad574c5fc16.png)

### Getting multiple macros

![image](https://cloud.githubusercontent.com/assets/995160/17576131/8940e558-5f3d-11e6-8a57-20bf52328fe0.png)

### Deleting a macro

![image](https://cloud.githubusercontent.com/assets/995160/17576151/aa2e14ac-5f3d-11e6-9a1f-2622264f1be2.png)

### Deleting all macros

![image](https://cloud.githubusercontent.com/assets/995160/17576156/bfdec8fa-5f3d-11e6-8947-2f4570b695ee.png)

## API

### [macros](index.js#L77)

Handle macro processing and storing for an array of arguments.

Set macros by specifying using the `--macro` option and a list of values.
Remove a macro by specifying `--macro` and `--del` options.
Default is to replace values in the `argv` array with stored macro values (if found).

**Params**

* `name` **{String}**: Custom name of the [data-store](https://github.com/jonschlinkert/data-store) to use. Defaults to 'macros'.
* `options` **{Object}**: Options to pass to the store to control the name or instance of the [date-store](https://github.com/jonschlinkert/date-store)
* `options.name` **{String}**: Name of the [data-store](https://github.com/jonschlinkert/data-store) to use for storing macros. Defaults to `macros`
* `options.store` **{Object}**: Instance of [data-store](https://github.com/jonschlinkert/data-store) to use. Defaults to `new DataStore(options.name)`
* `options.parser` **{Function}**: Custom argv parser to use. Defaults to [yargs-parser](https://github.com/yargs/yargs-parser)
* `returns` **{Function}**: argv parser to process macros

**Example**

```js
// create an argv parser
var parser = macros('custom-macro-store');

// get arguments from the command line input
var argv = process.argv.slice(2);

// parse the input
var res = parser(argv);
// =>  {
// =>    action: 'get', // ['none', 'set', 'get', 'del'],
// =>    orig: ['foo'], // original argv array
// =>    argv: ['bar'], // updated argv array (if get action)
// =>    args: { _: ['foo'] } // parsed args from the specified parser.
// =>  }

// following input will produce the following results:
//
// Set 'foo' as ['bar', 'baz', 'bang']
// $ app --macro foo bar baz bang
// =>  {
// =>    action: 'set',
// =>    orig: ['--macro', 'foo', 'bar', 'baz', 'bang'],
// =>    argv: ['--macro', 'foo', 'bar', 'baz', 'bang'],
// =>    args: { _: ['bar', 'baz', 'bang'], macro: 'foo' }
// =>  }
//
// Use 'foo'
// $ app foo
// =>  {
// =>    action: 'get',
// =>    orig: ['foo'],
// =>    argv: ['bar', 'baz', 'bang'],
// =>    args: { _: ['foo'] }
// =>  }
//
// Remove the 'foo' macro
// $ app --macro --del foo
// =>  {
// =>    action: 'del',
// =>    orig: ['--macro', '--del', 'foo'],
// =>    argv: ['--macro', '--del', 'foo'],
// =>    args: { _: [], macro: true, del: 'foo' }
// =>  }
```

### [parser](index.js#L99)

Parser function used to parse the argv array and process macros.

**Params**

* `argv` **{Array}**: Array of arguments to process
* `options` **{Object}**: Additional options to pass to the argv parser
* `returns` **{Object}**: Results object [described above](#macros)

### [Store](index.js#L155)

Exposes `Store` for low level access

**Example**

```js
var store = new macros.Store({name: 'custom-macro-store'});
```

### [Store](lib/store.js#L30)

Initialize a new `Store` with the given `options`.

**Params**

* `options` **{Object}**
* `options.name` **{String}**: Name of the json file to use for storing macros. Defaults to 'macros'
* `options.store` **{Object}**: Instance of [data-store](https://github.com/jonschlinkert/data-store) to use. Allows complete control over where the store is located.

**Example**

```js
var macroStore = new Store();
//=> '~/data-store/macros.json'

var macroStore = new Store({name: 'abc'});
//=> '~/data-store/abc.json'
```

### [.set](lib/store.js#L53)

Set a macro in the store.

**Params**

* `key` **{String}**: Name of the macro to set.
* `arr` **{Array}**: Array of strings that the macro will resolve to.
* `returns` **{Object}** `this`: for chaining

**Example**

```js
macroStore.set('foo', ['foo', 'bar', 'baz']);
```

### [.get](lib/store.js#L75)

Get a macro from the store.

**Params**

* `name` **{String}**: Name of macro to get.
* `returns` **{String|Array}**: Array of tasks to get from a stored macro, or the original name when a stored macro does not exist.

**Example**

```js
var tasks = macroStore.get('foo');
//=> ['foo', 'bar', 'baz']

// returns input name when macro is not in the store
var tasks = macroStore.get('bar');
//=> 'bar'
```

### [.del](lib/store.js#L92)

Remove a macro from the store.

**Params**

* `name` **{String|Array}**: Name of a macro or array of macros to remove.
* `returns` **{Object}** `this`: for chaining

**Example**

```js
macroStore.del('foo');
```

## About

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Building docs

_(This document was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme) (a [verb](https://github.com/verbose/verb) generator), please don't edit the readme directly. Any changes to the readme must be made in [.verb.md](.verb.md).)_

To generate the readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-generate-readme && verb
```

### Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

### Author

**Brian Woodward**

* [github/doowb](https://github.com/doowb)
* [twitter/doowb](http://twitter.com/doowb)

### License

Copyright © 2016, [Brian Woodward](https://github.com/doowb).
Released under the [MIT license](https://github.com/doowb/macro-store/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on August 10, 2016._