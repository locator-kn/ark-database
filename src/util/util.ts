declare
var Promise:any;

export default
class Util {
    constructor(private db:any) {
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
    }
}