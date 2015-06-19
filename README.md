# ark-database
Database-Plugin for [ark](https://github.com/locator-kn/ark) our application server of [locator-app.com](http://www.locator-app.com/)

## Usage
```npm install ark-database```  to install the plugin (use the option ```-S``` to include it in your project)

```js
var Database = require('ark-database'); // import it to your code

var db = new Database('alice'); // set up database

// example calls
db.getUserById('1234567890', function(err, res) {
   console.log(res);
});

db.createTrip(newTrip,  function(err, res) {
   console.log(res);
});

db.deleteLocationById('12322456576567',  function(err, res) {
   console.log(res);
});
```
> Note: We are slowly changing from using callbacks to promises ([issue #35](https://github.com/locator-kn/ark-database/issues/35)). When in doubt look up the source code.

## Server administration
How to configure or maintain the actual database on our server, look here: [Server-Administration](https://github.com/locator-kn/ark/wiki/Server-administration)


## Tests

Tests can be run with `npm test` or `make test`, `make test-cov` and `test-cov-html`.
Note:  `npm test` points to `make test-cov`. This is inspired from many hapi plugins.
