export default
class Util {


    constructor(private db:any, private LISTS:any) {
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
}