declare
var Promise:any;

export default
class Util {
    private boom:any;

    constructor(private db:any) {
        this.boom = require('boom');
    }

    /**
     * Update one or more field of a document and returns a promise
     * @param documentid
     * @param object
     */
    updateDocument = (documentid:string, object:any) => {
        return new Promise((resolve, reject) => {
            this.db.merge(documentid, object, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            })
        });
    };

    /**
     * Create a view or list
     * @param name
     * @param views
     * @param callback
     */
    createView = (name:string, views, callback) => {
        this.db.save(name, views);
        return callback(null, 'View created!');
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
                return callback(err)
            }
            var fieldValue = result.field;
            if (!fieldValue) {
                return callback(this.boom.create('field in document not found', 404))
            }

            var toUpdate = {};
            toUpdate[field] = fieldValue.concat(valueToAppend);

            this.db.merge(documentid, toUpdate, callback);
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
                if (response != 200) {
                    return reject(this.boom.create(response, 'entry in database was not found'));
                }
                if (err) {
                    return reject(err);
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
                return callback(err);
            }
            if (!result.length) {
                return callback(this.boom.create(404, 'Database entry not found'))
            }
            // return first entry from array
            return callback(null, result[0]);
        });
    };

    /**
     * Create document with Timestamp.
     *
     * @param element
     * @param callback
     */
    createDocument = (element, callback) => {
        var date = new Date();
        element.create_date = date.toISOString();
        this.db.save(element, callback);
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
        this.db.merge(documentId, document, callback)
    };
}