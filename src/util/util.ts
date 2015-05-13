export default
class Util {
    constructor(private db:any) {
    }

    /**
     * Update one or more field of a document
     * @param documentid
     * @param object
     * @param callback
     */
    updateDocument = (documentid:string, object:any, callback) => {
        this.db.merge(documentid, object, callback)
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