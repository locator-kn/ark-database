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

    database.save(designChat.title, designChat.content);

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
                            resetPasswordExpires: doc.resetPasswordExpires,
                            resetPasswordToken: doc.resetPasswordToken,
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
            accommodations_equipment: {
                "map": function (doc) {
                    if (doc.type == 'accommodation_equipment') {
                        emit(doc._id, doc);
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

var designLocation = {
    title: "_design/location",
    content: {
        views: {
            location: {
                "map": function (doc) {
                    if (doc.type == 'location') {
                        emit(doc._id, doc);
                    }
                }
            },
            user: {
                "map": function (doc) {
                    if (doc.type == 'location') {
                        emit(doc.userid, doc);
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

var designTrip = {
    title: "_design/trip",
    content: {
        views: {
            trip: {
                "map": function (doc) {
                    if (doc.type == 'trip') {
                        emit(doc._id, doc);
                    }
                }
            },
            city: {
                "map": function (doc) {
                    if (doc.type == 'trip' && doc.active == true) {
                        emit(doc.city, doc);
                    }
                }
            },
            preTripById: {
                "map": function (doc) {
                    if (doc.type == 'preTrip') {
                        emit(doc._id, doc);
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

var designMail = {
    title: "_design/mail",
    content: {
        views: {
            registration: {
                "map": function (doc) {
                    if (doc.type == 'mail_registration') {
                        emit(doc._id, doc);
                    }
                }
            },
            password_forgotten: {
                "map": function (doc) {
                    if (doc.type == 'mail_forgotten') {
                        emit(doc._id, doc);
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

var designChat = {
    title: "_design/chat",
    content: {
        views: {
            conversationsByUserId: {
                "map": function (doc) {
                    if (doc.type === 'conversation') {
                        emit([doc.user_1, doc.user_2], doc);
                    }
                }
            },
            conversationsById: {
                "map": function (doc) {
                    if (doc.type === 'conversation') {
                        emit(doc._id, doc);
                    }
                }
            },
            messagesByConversationId: {
                "map": function (doc) {
                    if (doc.type == 'message') {
                        emit(doc.conversation_id, doc);
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
            },
            listallByUserId: function (head, req) {
                var result = [];
                var row;
                while (row = getRow()) {
                    if (row.key[0] == req.query.userId || row.key[1] == req.query.userId) {
                        result.push(row.value);
                    }
                }
                send(JSON.stringify(result));
            },
            getExistingConversationByUsers: function (head, req) {
                var result = [];
                var row;
                while (row = getRow()) {
                    if ((row.key[0] == req.query.userId || row.key[1] == req.query.userId) && (row.key[0] == req.query.userId2 || row.key[1] == req.query.userId2)) {
                        result.push(row.value);
                    }
                }
                send(JSON.stringify(result));
            }
        }
    }
};