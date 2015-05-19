export function setUpDesignDocuments(database:any, callback:any) {

    database.save(designUser.title, designUser.content);

    database.save(designData.title, designData.content);

    database.save(location.title, location.content);

    database.save(staticdata.title, staticdata.content);

    database.save(trip.title, trip.content);

    callback(null, "Views created")


}

// user design document
var designUser = {
    title: "_design/user",
    content: {
        "language": "javascript",
        "views": {
            "login": {
                "map": "function(doc) {\n if(doc.type == 'user') {\n   emit(doc._id, {\n\tname: doc.name,\n    password: doc.password, \n   strategy: doc.strategy, \nmail: doc.mail\n   });\n }\n}"
            },
            "user": {
                "map": "function(doc) {\n if(doc.type == 'user') {\n   emit(doc._id, doc);\n }\n}"
            }
        },
        "lists": {
            "listall": "function (head, req) { var row; var result = []; while (row = getRow()) { result.push(row.value); } send(JSON.stringify(result)); }"
        }
    }
};

var designData = {
    title: "_design/data",
    content: {
        "language": "javascript",
        "views": {
            "moods": {
                "map": "function(doc) {\n if(doc.type== 'mood') {\n   emit(doc._id, doc);\n   }\n}"
            },
            "cities": {
                "map": "function(doc) {\n if(doc.type== 'city') {\n   emit(doc._id, doc);\n   }\n}"
            },
            "accommodations": {
                "map": "function(doc) {\n if(doc.type== 'accommodation') {\n   emit(doc._id, doc);\n   }\n}"
            },
            "cities_trips": {
                "map": "function(doc) {\n if(doc.type== 'trip') {\n   emit([doc.city], 1);\n   }\n}",
                "reduce": "function(keys, values, rereduce) {\nvar obj = keys[0][0][0];\n  var a = {id: obj.id, title: obj.title, total: sum(values),  place_id: obj.place_id};\nreturn a;\n}"
            }
        },
        "lists": {
            "listall": "function (head, req) { var row; var result = []; while (row = getRow()) { result.push(row.value); } send(JSON.stringify(result)); }"
        }
    }
};

var location = {
    title: "_design/location",
    content: {
        "language": "javascript",
        "views": {
            "location": {
                "map": "function(doc) {\n if (doc.type == 'location') {\n  emit(doc._id, doc);\n }\n}"
            },
            "user": {
                "map": "function(doc) {\n if (doc.type == 'location') {\n  emit(doc.userid, doc);\n }\n}"
            }
        },
        "lists": {
            "listall": "function (head, req) { var row; var result = []; while (row = getRow()) { result.push(row.value); } send(JSON.stringify(result)); }"
        }
    }
};

var staticdata = {
    title: "_design/static",
    content: {
        "language": "javascript",
        "views": {
            "moods": {
                "map": "function(doc) {\n if(doc.type== 'mood') {\n   emit(doc._id, doc);\n   }\n}"
            }
        },
        "lists": {
            "listall": "function (head, req) { var row; var result = []; while (row = getRow()) { result.push(row.value); } send(JSON.stringify(result)); }"
        }
    }
};

var trip = {
    title: "_design/trip",
    content: {
        "language": "javascript",
        "views": {
            "trip": {
                "map": "function(doc) {\n if(doc.type == 'trip') {\n   emit(doc._id, doc);\n   }\n}"
            },
            "city": {
                "map": "function(doc) {\n if(doc.type == 'trip') {\n   emit(doc.city, doc);\n   }\n}"
            },
            "citybyid": {
                "map": "function(doc) {\n if(doc.type == 'trip') {\n   emit(doc.city, doc._id);\n   }\n}",
                "reduce": "function(keys, values) {\n                         var voucherTypes = [];\n                         values.forEach(function(v) {\n                             voucherTypes = voucherTypes.concat(v);\n                         });\n                         return voucherTypes;\n                     }"
            },
            "search": {
                "map": "function(doc) {\n if(doc.type == 'trip') {\n   emit([doc.city, doc.category], doc);\n   }\n}"
            }
        },
        "lists": {
            "listall": "function (head, req) { var row; var result = []; while (row = getRow()) { result.push(row.value); } send(JSON.stringify(result)); }"
        }
    }
};