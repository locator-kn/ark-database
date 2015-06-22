// describe the shape of libraries not written in TypeScript
declare var emit:any;
declare var getRow:any;
declare var send:any;
declare var sum:any;
declare var toJSON:any;


export function setUpDesignDocuments(database:any, callback:any) {

    database.save(designUser.title, designUser.content, callback);

    database.save(designData.title, designData.content, callback);

    database.save(designLocation.title, designLocation.content, callback);

    database.save(designTrip.title, designTrip.content, callback);

    database.save(designMail.title, designMail.content, callback);

    database.save(designChat.title, designChat.content, callback);

}

// user design document
var designUser = {
    title: "_design/user",
    content: {
        language: 'javascript',
        views: {
            login: {
                "map": function (doc) {
                    if (doc.type == 'user' && !doc.delete) {
                        emit(doc.mail, {
                            name: doc.name,
                            password: doc.password,
                            strategy: doc.strategy,
                            resetPasswordExpires: doc.resetPasswordExpires,
                            resetPasswordToken: doc.resetPasswordToken,
                            mail: doc.mail,
                            isAdmin: doc.isAdmin,
                            _id: doc._id
                        });
                    }
                }
            },
            loginAdmin: {
                "map": function (doc) {
                    if (doc.type == 'user' && doc.isAdmin && !doc.delete) {
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
                    if (doc.type == 'user' && !doc.delete) {
                        emit(doc._id, doc);
                    }
                }
            },
            user_public: {
                "map": function (doc) {
                    if (doc.type == 'user' && !doc.delete) {
                        emit(doc._id, {
                            _id: doc._id,
                            name: doc.name,
                            surname: doc.surname,
                            picture: doc.picture,
                            birthdate: doc.birthdate,
                            city: doc.city,
                            description: doc.description,
                            residence: doc.residence
                        });
                    }
                }
            },
            uuid: {
                "map": function (doc) {
                    if (doc.type == 'user' && !doc.delete) {
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
        language: 'javascript',
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
            cities_trips: {
                "map": function (doc) {
                    if (doc.type == 'trip' && !doc.delete && doc.public) {
                        emit(doc.city, 1);
                    }
                },
                "reduce": function (keys, values, rereduce) {
                    var obj = keys[0][0];
                    return {id: obj.id, title: obj.title, total: sum(values), place_id: obj.place_id};

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
        language: 'javascript',
        views: {
            location: {
                "map": function (doc) {
                    if (doc.type == 'location' && !doc.delete) {
                        emit(doc._id, doc);
                    }
                }
            },
            locationByUser: {
                "map": function (doc) {
                    if (doc.type == 'location' && !doc.preLocation && !doc.delete) {
                        emit(doc.userid, doc);
                    }
                }
            },
            preLocationByUser: {
                "map": function (doc) {
                    if (doc.type == 'location' && doc.preLocation && !doc.delete) {
                        emit(doc.userid, doc);
                    }
                }
            },
            publicLocationByUser: {
                "map": function (doc) {
                    if (doc.type == 'location' && !doc.preLocation && !doc.delete && doc.public) {
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
        language: 'javascript',
        views: {
            trip: {
                "map": function (doc) {
                    if (doc.type == 'trip' && !doc.delete) {
                        emit(doc._id, doc);
                    }
                }
            },
            city: {
                "map": function (doc) {
                    if (doc.type == 'trip' && doc.public && !doc.delete) {
                        emit(doc.city.id, doc);
                    }
                }
            },
            preTripById: {
                "map": function (doc) {
                    if (doc.type == 'preTrip' && !doc.delete) {
                        emit(doc._id, doc);
                    }
                }
            },
            tripByUserId: {
                "map": function (doc) {
                    if (doc.type == 'trip' && doc.public && !doc.delete) {
                        emit([doc.userid, doc.end_date], doc);
                    }
                }
            },
            myTrips: {
                "map": function (doc) {
                    if (doc.type == 'trip' && !doc.delete) {
                        emit([doc.userid, doc.end_date], doc);
                    }
                }
            },
            tripsByLocation: {
                "map": function (doc) {
                    if (doc.type == 'trip' && !doc.delete) {
                        for (var key in doc.locations) {
                            emit(key, doc);
                        }

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
        language: 'javascript',
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
