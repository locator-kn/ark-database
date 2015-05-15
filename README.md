# tripl-database


## CouchDB views

### 'user/user'
This view display all user information.

```javascript
function(doc) {
 if(doc.type == 'user') {
   emit(doc._id, {
	_rev: doc._rev,
	picture: doc.picture,
	name: doc.name, 
	surname: doc.surname,
	mail: doc.mail,
	});
 }
}
```
### 'user/login'
View to display login information.

```javascript
function(doc) {
 if(doc.type == 'user') {
   emit(doc._id, {
   	password: doc.password
   });
 }
}
```


### 'trip/trip'
View to display all trips - type = 'trip'


```javascript
function(doc) {
 if(doc.type == 'trip') {
   emit(doc._id, doc);
   }
}
```

### 'data/acc'
View to display all Accommodation - type = 'acc'


```javascript
function(doc) {
 if(doc.type == 'acc') {
   emit(doc._id, doc);
   }
}
```

### 'data/city'
View to display all cities - type = 'city'


```javascript
function(doc) {
 if(doc.type == 'city') {
   emit(doc._id, doc);
   }
}
```

### 'data/mood'
View to display all moods - type = 'mood'


```javascript
function(doc) {
 if(doc.type == 'mood') {
   emit(doc._id, doc);
   }
}
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
