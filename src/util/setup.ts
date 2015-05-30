// describe the shape of libraries not written in TypeScript
declare
var emit:any;
declare
var getRow:any;
declare
var send:any;
declare
var sum:any;


export function setUpDesignDocuments(database:any, callback:any) {

    database.save(designUser.title, designUser.content);

    database.save(designData.title, designData.content);

    database.save(designLocation.title, designLocation.content);

    database.save(designTrip.title, designTrip.content);

    database.save(designMail.title, designMail.content);

    callback(null, "Views created")
}

// user design document
var designUser = {
    title: "_design/user",
    content: {
        views: {
            login: {
                "map": function (doc) {
                    if (doc.type == 'user') {
                        emit(doc.mail, {
                            name: doc.name,
                            password: doc.password,
                            strategy: doc.strategy,
                            mail: doc.mail,
                            _id: doc._id
                        });
                    }
                }
            },
            user: {
                "map": function (doc) {
                    if (doc.type == 'user') {
                        emit(doc._id, doc);
                    }
                }
            },
            uuid: {
                "map": function (doc) {
                    if (doc.type == 'user') {
                        emit(doc.uuid, doc);
                    }
                }
            }
        },
        lists: {
            listall: function (head, req) {
                var row;
                var result = [];
                while (row = getRow()) {
                    result.push(row.value);
                }
                send(JSON.stringify(result));
            }
        }
    }
};

var designData = {
    title: "_design/data",
    content: {
        views: {
            moods: {
                "map": function (doc) {
                    if (doc.type == 'mood') {
                        emit(doc._id, doc);
                    }
                }
            },
            cities: {
                "map": function (doc) {
                    if (doc.type == 'city') {
                        emit(doc._id, doc);
                    }
                }
            },
            accommodations: {
                "map": function (doc) {
                    if (doc.type == 'accommodation') {
                        emit(doc._id, doc);
                    }
                }
            },
            cities_trips: {
                "map": function (doc) {
                    if (doc.type == 'trip') {
                        emit([doc.city], 1);
                    }
                },
                "reduce": function (keys, values, rereduce) {
                    var obj = keys[0][0][0];
                    var a = {id: obj.id, title: obj.title, total: sum(values), place_id: obj.place_id};
                    return a;
                }
            },
            "accommodations_equipment": {
                "map": "function(doc) {\n if(doc.type== 'accommodation_equipment') {\n   emit(doc._id, doc);\n   }\n}"
            }
        },
        "lists": {
            "listall": "function (head, req) { var row; var result = []; while (row = getRow()) { result.push(row.value); } send(JSON.stringify(result)); }"
        }
    }
};

var designLocation = {
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

var designTrip = {
    title: "_design/trip",
    content: {
        "language": "javascript",
        "views": {
            "trip": {
                "map": "function(doc) {\n if(doc.type == 'trip') {\n   emit(doc._id, doc);\n   }\n}"
            },
            "city": {
                "map": "function(doc) {\n if(doc.type == 'trip' && doc.active == true) {\n   emit(doc.city, doc);\n   }\n}"
            },
            "preTripById": {
                "map": "function(doc) {\n if(doc.type == 'preTrip') {\n   emit(doc._id, doc);\n   }\n}"
            }
        },
        "lists": {
            "listall": "function (head, req) { var row; var result = []; while (row = getRow()) { result.push(row.value); } send(JSON.stringify(result)); }"
        }
    }
};

var designMail = {
    title: "_design/mail",
    content: {
        "language": "javascript",
        "views": {
            "registration": {
                "map": "function(doc) {\n if(doc.type== 'mail_registration') {\n   emit(doc._id, doc);\n   }\n}"
            }
        },
        "lists": {
            "listall": "function (head, req) { var row; var result = []; while (row = getRow()) { result.push(row.value); } send(JSON.stringify(result)); }"
        }
    }
};
