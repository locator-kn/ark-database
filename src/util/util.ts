declare var Promise:any;

import {log} from './../logging/logging'

var Boom = require('boom');
var Hoek = require('hoek');

export default
class Util {

    constructor(private db:any) {
    }

    /**
     * Retrieve a document from database. Doesn't return deleted ones
     * @param documentId
     * @returns Promise
     */
    getDocument = (documentId) => {
        return new Promise((resolve, reject) => {
            this.db.get(documentId, (err, res) => {

                if (err) {
                    return reject(Boom.badRequest(err));
                }

                if (res.delete) {
                    return reject(Boom.notFound('deleted'))
                }

                resolve(res);
            })
        })
    };

    /**
     * Create document with Timestamp.
     *
     * @param element
     */
    createDocument = (element) => {
        var date = new Date();
        element.create_date = date.toISOString();
        element.modified_date = date.toISOString();

        return new Promise((resolve, reject) => {

            this.db.save(element, (err, data) => {

                if (err) {
                    return reject(Boom.badRequest(err));
                }
                return resolve(data);
            });
        });

    };

    /**
     * Update one or more field(s) of a document and returns a promise.
     * The provided type ensures that the correct document is updated
     * @param documentId
     * @param object
     * @param type
     */
    updateDocument = (documentId:string, userid:string, object:any, type:string, deepMerge:boolean) => {
        return new Promise((resolve, reject) => {

            this.db.get(documentId, (err, res) => {

                if (err) {
                    return reject(Boom.badRequest(err));
                }

                if (!res.type || res.type !== type) {
                    log('User ' + userid + ' tried to update ' + res.type + ' with ' + type);
                    return reject(Boom.notAcceptable('Wrong document type'));
                }

                if (!res.userid || res.userid !== userid) {
                    if (userid !== documentId) {
                        return reject(Boom.forbidden());
                    }
                }

                if (res.delete) {
                    return reject(Boom.notFound('deleted'));
                }

                // update modified_date
                var date = new Date();
                object.modified_date = date.toISOString();

                if (deepMerge) {

                    // remove old tags
                    if (res.tags) {
                        res.tags = [];
                    }

                    // deep merge of values before merge into database
                    object = Hoek.merge(res, object);
                }

                this.db.merge(documentId, object, (err, result) => {
                    if (err) {
                        return reject(Boom.badRequest(err));
                    }
                    return resolve(result);
                });
            });
        });
    };


    /**
     * Deletes a document in the database. Makes sure, that the document with the right type is deleted
     * @param documentid
     * @param type
     */
    deleteDocument = (documentid:string, userid:string, type:string) => {
        return new Promise((resolve, reject) => {

            this.db.get(documentid, (err, res) => {

                if (err) {
                    return reject(Boom.badRequest(err));
                }

                if (!res.type || res.type !== type) {
                    return reject(Boom.notAcceptable('Wrong document type'));
                }

                if (!res.userid || res.userid !== userid) {
                    return reject(Boom.forbidden('Wrong user'));
                }

                if (res.delete) {
                    return reject(Boom.notFound('deleted'));
                }

                this.db.merge(documentid, {delete: true, deleteDate: new Date()}, (err, result) => {

                    if (err) {
                        return reject(Boom.badRequest(err));
                    }
                    return resolve(result);
                });
            });
        });
    };

    /**
     * Get paginated results from a certain view, according to elements & page
     * @param view
     * @param elements
     * @param page
     */
    getPagedResults = (view:string, elements:any, page:any, options:any) => {
        var requestOptions:any = {};

        if (page >= 0) {
            requestOptions.limit = elements;
            requestOptions.skip = elements * page;
        }

        Hoek.merge(requestOptions, options);

        return new Promise((resolve, reject) => {
            this.db.view(view, requestOptions, (err, res) => {

                if (err) {
                    return reject(Boom.badRequest(err))
                }
                resolve(res);
            })
        })

    };

    /**
     * Appends value to already existing value in a document.
     * @param documentid
     * @param field
     * @param valueToAppend
     */
    appendFieldValue = (documentid:string, field:string, valueToAppend:any, type:string) => {
        return Promise((resolve, reject) => {

            this.db.get(documentid, (err, result) => {

                if (err) {
                    return reject(Boom.badRequest(err));
                }

                if (result.delete) {
                    return reject(Boom.notFound('deleted'));
                }

                var toUpdate = {};
                var fieldValue = result.field;

                // if field is not present create a new one
                if (!fieldValue) {
                    toUpdate[field] = valueToAppend;
                } else {
                    toUpdate[field] = fieldValue.concat(valueToAppend);
                }

                return this.updateDocument(documentid, documentid, toUpdate, type, false);
            });
        })
    };

    /**
     * Inverts the boolean value of the public field of a document and return the new value.
     * @param documentId
     * @param userid
     * @param type
     * @returns {any}
     */
    togglePublic = (documentId:string, userid:string, type:string) => {
        var publicValue;

        this._preCheck(documentId, type, userid)
            .then((document:any)=> {

                // switch public value
                publicValue = !document.public;
                document.public = publicValue;

                return this._mergeDocument(documentId, document, document, false)
            }).then((res:any) => {

                // return new public value
                res.value = publicValue;
                return Promise.resolve(res);
            });
    };

    /**
     * Utility method for checking if a entry in the database exist.
     * If an attachment name is emitted, this method is going to check if this file
     * exists in the database.
     * @param documentID
     * @param attachmentName (optional)
     * @returns a resolved promise, if the entry exit, rejected promise otherwise.
     */
    entryExist = (documentid:string, attachmentName:string) => {

        var queryName = '/' + documentid;

        if (attachmentName) {
            queryName += '/' + attachmentName;
        }

        var options = {
            method: 'HEAD',
            path: queryName
        };

        return new Promise((resolve, reject) => {
            // check if the document exist (or attachment), by sending a lightweight HEAD request
            this.db.query(options, (err, data, response) => {

                if (err) {
                    return reject(Boom.badRequest(err));
                }
                if (response !== 200) {
                    return reject(Boom.notFound('entry in database was not found'));
                }

                return resolve(true);
            });
        });
    };

    /**
     * Retrieve a single value from a list with given key
     * @param keyValue
     * @param list
     * @returns {any}
     */
    retrieveSingleValue = (list:string, keyValue:any) => {
        return new Promise((resolve, reject) => {

            this.db.list(list, {key: keyValue}, (err, result) => {

                if (err) {
                    return reject(Boom.badRequest(err));
                }
                if (!result.length || result[0].delete) {
                    return reject(Boom.notFound('Database entry not found'))
                }
                // return first entry from array
                return resolve(result[0]);
            });
        });
    };

    /**
     * Query a design document (list) with the given key and returns a promise.
     * @param keyValue
     * @param list
     * @returns {any}
     */
    retrieveAllValues = (list:string, options:any) => {
        return new Promise((resolve, reject) => {

            this.db.list(list, options, (err, data) => {

                if (err) {
                    return reject(Boom.badRequest(err));
                }
                resolve(data);
            });
        });
    };


    /**
     * Update document by id and update modified_date.
     *
     * @param documentId
     * @param document
     * @param callback
     */
    updateDocumentWithCallback = (documentId:string, document:any, callback) => {
        var date = new Date();
        document.modified_date = date.toISOString();
        this.db.merge(documentId, document, (err, data) => {
            if (err) {
                return callback(Boom.badRequest(err))
            }
            return callback(null, data);
        });
    };


    /**
     * USE WITH CAUTION!! This method updates a document without checking for correct type or possessing user.
     * Use only if you are absolutely certain what are you doing. If not, use updateDocument().
     * @param documentId
     * @param document
     * @returns {any}
     */
    updateDocumentWithoutCheck = (documentId:string, document:any) => {
        var date = new Date();
        document.modified_date = date.toISOString();
        return new Promise((resolve, reject) => {

            this.db.get(documentId, (err, res) => {

                if (err) {
                    return reject(Boom.badRequest(err));
                }

                if (res.delete) {
                    return reject(Boom.notFound('deleted'));
                }

                // deep merge of values before merge into database
                var mergedLocation = Hoek.merge(res, document);

                this.db.merge(documentId, mergedLocation, (err, data) => {

                    if (err) {
                        return reject(Boom.badRequest(err));
                    }
                    return resolve(data);
                });
            });
        });
    };


    _preCheck = (documentId:string, type:string, userid:string) => {
        return new Promise((resolve, reject) => {
            this.db.get(documentId, (err, document) => {

                if (err) {
                    return reject(Boom.badRequest(err));
                }

                if (document.delete) {
                    return reject(Boom.notFound('deleted'));
                }

                if (!document.type || document.type !== type) {
                    return reject(Boom.notAcceptable('Wrong document type'));
                }

                if (document.delete) {
                    return reject(Boom.notFound('deleted'));
                }

                // check on correct possession, userid is given
                if (userid && (!document.userid || document.userid !== userid)) {
                    return Promise.reject(Boom.forbidden());
                }


                resolve(document)
            })
        })
    };

    _mergeDocument = (documentId:string, originalDoc:any, newDoc:any, deepMerge:boolean) => {

        // update modified_date
        var date = new Date();
        newDoc.modified_date = date.toISOString();

        if (deepMerge) {
            // deep merge of values before merge into database
            newDoc = Hoek.merge(originalDoc, newDoc);
        }

        return new Promise((resolve, reject) => {

            this.db.merge(documentId, newDoc, (err, data) => {

                if (err) {
                    return reject(Boom.badRequest(err));
                }
                return resolve(data);
            });
        })
    };


    /**
     * Function for copying a document
     * @param documentid
     * @returns Promise
     */
    copyDocument = (documentid:string) => {
        return new Promise((resolve, reject)=> {

            var createOptions = {
                method: 'POST',
                path: '/',
                body: {}
            };

            this.db.query(createOptions, (err, data, response) => {

                if (err) {
                    return reject(Boom.badRequest(err))
                }

                if (response >= 400) {
                    return reject(Boom.create(response))
                }

                var options = {
                    method: 'COPY',
                    path: '/' + documentid,
                    headers: {
                        destination: data.id
                    }
                };

                this.db.query(options, (err, data, response)=> {

                    if (err) {
                        return reject(Boom.badRequest(err))
                    }

                    if (response >= 400) {
                        return reject(Boom.create(response))
                    }

                    resolve(data)
                });
            })
        })
    };


    /**
     * Create a view or list
     * @param name
     * @param views
     * @param callback
     */
    createView = (name:string, views, callback) => {
        this.db.save(name, views, callback);
    };

}
