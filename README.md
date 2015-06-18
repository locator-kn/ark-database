# ark-database
Database-Plugin for [ark](https://github.com/locator-kn/ark) our application server of [locator-app.com](http://www.locator-app.com/)

## Usage
```npm install ark-database```  use the option ```-S``` to include it in your project

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

## Server

### open port on server

**Server stop**: *"ps -U couchdb -o pid= | xargs kill -9"* -> because "sudo /etc/init.d/couchdb stop" stop doesn't work!

**Changes**: *"etc/couchdb/local.ini"* -> change **bind_address = 0.0.0.0** instead of 127.0.0.1

**Server start**: *"sudo /etc/init.d/couchdb start"*

### load input from other database in local db

```
 curl -H 'Content-Type: application/json' -X POST http://localhost:5984/_replicate -d ' {"source": "http://locator.in.htwg-konstanz.de:5984/app", "target": "http://localhost:5984/app", "create_target": true, "continuous": true} '
```


## Tests

Tests can be run with `npm test` or `make test`, `make test-cov` and `test-cov-html`.
Note:  `npm test` points to `make test-cov`. This is inspired from many hapi plugins.
