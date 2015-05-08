export default
class Attachment {
    Readable:any;
    stream:any;
    constructor(private db:any, private LISTS:any) {
        this.stream = require('stream');
        this.Readable = this.stream.Readable ||
            require('readable-stream').Readable;
    }

    /**
     * Returns the picture (attachment) with that name to that corresponding document
     * @param userid
     * @param callback
     */
    getPicture = (documentid:string, filename:string, callback) => {

        var stream = this.db.getAttachment(documentid,filename, err => {
            if (err) {
                callback(err);
                return;
            }
        });

        // wrap stream and return it
        callback(null, new this.Readable().wrap(stream));
    };
}