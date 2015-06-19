declare var Promise:any;

export default
class Util {
    private boom:any;
    private hoek:any;

    constructor(private db:any) {
        this.boom = require('boom');
        this.hoek = require('hoek');
    }

    /**
     * Update one or more field(s) of a document and returns a promise.
     * The provided type ensures that the correct document is updated
     * @param documentId
     * @param object
     * @param type
     */
    updateDocument = (documentId:string, userid:string, object:any, type:string) => {
        return new Promise((resolve, reject) => {

            this.db.get(documentId, (err, res) => {

                if (err) {
                    return reject(this.boom.badRequest(err));
                }

                if (!res.type || res.type !== type) {
                    return reject(this.boom.notAcceptable('Wrong document type'));
                }

                if (!res.userid || res.userid !== userid) {
                    return reject(this.boom.forbidden());
                }

                // update modified_date
                var date = new Date();
                object.modified_date = date.toISOString();

                this.db.merge(documentId, object, (err, result) => {
                    if (err) {
                        return reject(this.boom.badRequest(err));
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
                    return reject(this.boom.badRequest(err));
                }

                if (!res.type || res.type !== type) {
                    return reject(this.boom.notAcceptable('Wrong document type'));
                }

                if (!res.userid || res.userid !== userid) {
                    return reject(this.boom.forbidden('Wrong user'));
                }

                this.db.remove(documentid, (err, result) => {

                    if (err) {
                        return reject(this.boom.badRequest(err));
                    }
                    return resolve(result);
                });
            });
        });
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

    /**
     * Appends value to already existing value in a document.
     * @param documentid
     * @param field
     * @param valueToAppend
     * @param callback
     */
    appendFieldValue = (documentid:string, field:string, valueToAppend:any, callback) => {
        this.db.get(documentid, (err, result) => {

            if (err) {
                return callback(this.boom.badRequest(err));
            }
            var toUpdate = {};
            var fieldValue = result.field;

            // if field is not present create a new one
            if (!fieldValue) {
                toUpdate[field] = valueToAppend;
            } else {
                toUpdate[field] = fieldValue.concat(valueToAppend);
            }

            this.updateDocumentWithCallback(documentid, toUpdate, callback);
        });
    };

    /**
     * Utiliy method for checking if a entry in the database exist.
     * If an attachment name is emitted, this method is going to check if this file
     * exists in the database.
     * @param documentid
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

                if (response !== 200) {
                    return reject(this.boom.notFound('entry in database was not found'));
                }
                if (err) {
                    return reject(this.boom.badRequest(err));
                }

                return resolve(true);
            });
        });
    };

    /**
     * function to get only one object instead of an array.
     *
     * @param keyValue
     * @param listName
     * @param callback
     *
     */
    getObjectOf = (keyValue, listName, callback) => {
        this.db.list(listName, {key: keyValue}, (err, result) => {

            if (err) {
                return callback(this.boom.badRequest(err));
            }
            if (!result.length) {
                return callback(this.boom.notFound('Database entry not found'))
            }
            // return first entry from array
            return callback(null, result[0]);
        });
    };

    /**
     * Same function as getObjectOf but with a returned promise
     * @param keyValue
     * @param list
     * @returns {any}
     */
    retrieveSingleValue = (keyValue:any, list:string) => {
        return new Promise((resolve, reject) => {

            this.db.list(list, {key: keyValue}, (err, result) => {

                if (err) {
                    return reject(this.boom.badRequest(err));
                }
                if (!result.length) {
                    return reject(this.boom.notFound('Database entry not found'))
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
                    return reject(this.boom.badRequest(err));
                }
                resolve(data);
            });
        });
    };

    /**
     * Create document with Timestamp.
     *
     * @param element
     * @param callback
     */
    createDocument = (element, callback) => {
        callback = callback || this.noop;
        var date = new Date();
        element.create_date = date.toISOString();

        return new Promise((resolve, reject) => {

            this.db.save(element, (err, data) => {

                callback(err, data);
                if (err) {
                    return reject(this.boom.badRequest(err));
                }
                return resolve(data);
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
                return callback(this.boom.badRequest(err))
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
                    return reject(this.boom.badRequest(err));
                }

                // deep merge of values before merge into database
                var mergedLocation = this.hoek.merge(res, document);

                this.db.merge(documentId, mergedLocation, (err, data) => {

                    if (err) {
                        return reject(this.boom.badRequest(err));
                    }
                    return resolve(data);
                });
            });
        });
    };

    /**
     * empty pseudo callback
     */
    noop = () => {
    };
}