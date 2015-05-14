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
     * @param callback
     */
    updateDocument = (documentid:string, object:any) => {
        return new Promise((resolve, reject) => {
            this.db.merge(documentid, object, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
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
        callback(null, 'View created!');
    };

    /**
     * Utiliy method for checking if a entry in the database exist.
     * If an attachment name is emitted, this method is going to check if this file
     * exists in the database.
     * @param documentid
     * @param attachmentName
     * @returns {any}
     */
    entryExist = (documentid:string, attachmentName:string)=> {

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
    }
}