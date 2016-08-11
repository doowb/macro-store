'use strict';

var parser = require('./')('macro-store-examples');
var argv = parser(process.argv.slice(2));
console.log();
console.log(argv);
console.log();
