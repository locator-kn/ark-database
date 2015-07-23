// describe the shape of libraries not written in TypeScript
declare var emit:any;
declare var getRow:any;
declare var send:any;
declare var sum:any;
declare var toJSON:any;

var fse = require('fs-extra');
var path = require('path');
var imageUtil = require('locator-image-utility');


import {DEFAULT_LOCATION, DEFAULT_USER} from '../plugin';


export function setUpDesignDocuments(database:any, callback:any) {

    database.save(designUser.title, designUser.content, callback);

    database.save(designData.title, designData.content, callback);

    database.save(designLocation.title, designLocation.content, callback);

    database.save(designTrip.title, designTrip.content, callback);

    database.save(designChat.title, designChat.content, callback);

}

export function createDefaultLocationAndUser(database:any, password, callback:any) {

    createDefaultUser(database, password, callback);

    createDefaultLocation(database, callback);

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
            locationTags: {
                "map": function (doc) {
                    if (doc.type == 'location' && !doc.delete) {
                        emit(null, null); // v2 feature
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
                    if (!rereduce) {
                        var obj = keys[0][0];
                        return {id: obj.id, title: obj.title, total: values.length, place_id: obj.place_id};
                    } else {
                        var a = 0;
                        var curr = values[values.length - 1];
                        for (var i = 0; i < values.length; i++) {
                            a += values[i].total
                        }
                        return {id: curr.id, title: curr.title, total: a, place_id: curr.place_id}
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
                        emit(doc.userid, {_id: doc._id});
                    }

                    if (doc.type === 'user' && !doc.delete && doc.defaultLocation) {
                        emit(doc._id, {_id: doc.defaultLocation});
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
            },
            locationByCity: {
                "map": function (doc) {
                    if (doc.type == 'location' && !doc.preLocation && !doc.delete && doc.public) {
                        emit(doc.city.place_id, doc);
                    }
                }
            },
            locationByCityAndUser: {
                "map": function (doc) {
                    if (doc.type == 'location' && !doc.preLocation && !doc.delete) {
                        emit([doc.city.place_id, doc.userid], doc);
                    }
                }
            },
            locationByTrip: {
                "map": function (doc) {
                    if (doc.type == 'trip' && !doc.delete) {
                        for (var location in doc.locations) {
                            emit(doc._id, {_id: location})
                        }
                    }
                }
            },
            pagedLocationsByCity: {
                "map": function (doc) {
                    if (doc.type == 'location' && !doc.preLocation && !doc.delete && doc.public) {
                        emit(doc.city.place_id, {_id: doc._id});
                    }
                }
            },
            getAllLocationsPaged: {
                "map": function (doc) {
                    if (doc.type == 'location' && !doc.delete && !doc.preLocation && doc.public) {
                        emit([doc.create_date, doc._id], { _id: doc._id });
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
            },
            conversationsByTripId: {
                "map": function (doc) {
                    if (doc.trip && doc.type === 'conversation') {
                        emit(doc.trip, doc);
                    }
                }
            },
            messagesByConversationIdPage: {
                "map": function (doc) {
                    if (doc.type == 'message') {
                        emit([doc.conversation_id, doc.timestamp], {_id: doc._id});
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

var createDefaultLocation = (database:any, callback:any) => {

    // gather image information
    var originalPicture = path.resolve(__dirname, './../defaultData/default-location.jpeg');
    var ext = path.extname(path.basename(originalPicture)).substring(1);
    var readstreamPicture = fse.createReadStream(originalPicture);

    // simulate request
    var options = {
        path: '/api/v1/',
        id: DEFAULT_LOCATION,
        contentType: 'image/' + ext,
        stream: readstreamPicture,
    };

    var cropping = {
        x: 0,
        y: 0,
        width: 1389,
        height: 819
    };

    var imageProcessor = imageUtil.image.processor(options);
    if (imageProcessor.error) {
        return callback(imageProcessor.error);
    }

    var pictureData = imageProcessor.createFileInformation(DEFAULT_LOCATION, 'locations');
    var attachmentData = pictureData.attachmentData;

    // location document
    var defaultLocation = fse.readJsonSync(path.resolve(__dirname, './../defaultData/defaultlocation.json'));

    // decorate default location
    defaultLocation.userid = DEFAULT_USER;
    defaultLocation.images = {
        picture: pictureData.url,
        googlemap: 'https://maps.googleapis.com/maps/api/staticmap?zoom=15&markers=47.66841743450943,9.170437082648277'
    };
    defaultLocation.create_date = new Date().toISOString();
    defaultLocation.isDefault = true;

    database.save(DEFAULT_LOCATION, defaultLocation, (err, result) => {

        if (err) {
            return callback(err);
        }

        // create streams
        var max = imageProcessor.createCroppedStream(cropping, imageUtil.size.max.size);  // max
        var mid = imageProcessor.createCroppedStream(cropping, imageUtil.size.mid.size);  // mid
        var small = imageProcessor.createCroppedStream(cropping, imageUtil.size.small.size); //small
        var mobile = imageProcessor.createCroppedStream(cropping, imageUtil.size.mobile.size);  // mobile
        var mobilethumb = imageProcessor.createCroppedStream(cropping, imageUtil.size.mobileThumb.size);  // mobileThumb

        attachmentData.name = imageUtil.size.max.name;
        var writestream = database.saveAttachment(result, attachmentData, (err, result)=> {

            if (err) {
                return callback(err);
            }

            attachmentData.name = imageUtil.size.mid.name;
            var writestream = database.saveAttachment(result, attachmentData, (err, result)=> {

                if (err) {
                    return callback(err);
                }

                attachmentData.name = imageUtil.size.small.name;
                var writestream = database.saveAttachment(result, attachmentData, (err, result)=> {

                    if (err) {
                        return callback(err);
                    }

                    attachmentData.name = imageUtil.size.mobile.name;
                    var writestream = database.saveAttachment(result, attachmentData, (err, result)=> {

                        if (err) {
                            return callback(err);
                        }

                        attachmentData.name = imageUtil.size.mobileThumb.name;
                        var writestream = database.saveAttachment(result, attachmentData, callback);

                        // stream mobilethumb
                        mobilethumb.pipe(writestream);
                    });

                    // stream mobile
                    mobile.pipe(writestream);
                });

                // stream small
                small.pipe(writestream);
            });

            // stream mid
            mid.pipe(writestream);
        });

        // stream picture
        max.pipe(writestream);
    })

};

var createDefaultUser = (database:any, password:string, callback:any) => {

    var date = new Date();

    // gather image information
    var originalPicture = path.resolve(__dirname, './../defaultData/profile.jpeg');
    var thumbnailPicture = path.resolve(__dirname, './../defaultData/profile-thumb.jpeg');
    var filename = path.basename(originalPicture);
    var thumbnailname = path.basename(thumbnailPicture);
    var ext = path.extname(filename).substring(1);

    var defaultUser = fse.readJsonSync(path.resolve(__dirname, './../defaultData/defaultUser.json'));
    defaultUser.password = generatePassword(password);
    defaultUser.create_date = date.toISOString();
    defaultUser.picture = '/api/v1/users/' + DEFAULT_USER + '/' + filename;

    database.save(DEFAULT_USER, defaultUser, (err, result) => {

        if (err) {
            return callback(err);
        }


        var attachmentData = {
            'Content-Type': 'image/' + ext,
            name: 'user'
        };

        var readstream = fse.createReadStream(originalPicture);
        var writestream = database.saveAttachment(result, attachmentData, (err, result)=> {

            if (err) {
                return callback(err);
            }

            var attachmentData = {
                'Content-Type': 'image/' + ext,
                name: 'userThumb'
            };
            var readstream = fse.createReadStream(thumbnailPicture);
            var writestream = database.saveAttachment(result, attachmentData, callback);

            // stream thumbnail
            readstream.pipe(writestream);
        });

        // stream picture
        readstream.pipe(writestream);
    });
};

var generatePassword = (password:string) => {
    var bcrypt = require('bcrypt');
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

