export default
class Attachment {
    Readable:any;
    stream:any;
    boom:any;

    constructor(private db:any, private LISTS:any) {
        this.stream = require('stream');
        this.Readable = this.stream.Readable ||
            require('readable-stream').Readable;
        this.boom = require('boom');
    }

    /**
     * Returns the picture (attachment) with that name to that corresponding document
     * @param documentid
     * @param userid
     * @param callback
     */
    getPicture = (documentid:string, filename:string, callback) => {

        return new this.Readable().wrap(this.db.getAttachment(documentid, filename, (err) => {
            // TODO: log error
        }));

    };

    /**
     *
     * @param documentId
     * @param filename
     * @param readStream
     * @param callback
     */
    savePicture = (documentId:string, filename:string, readStream:any, callback) => {

        var attachmentData = {
            name: filename,
            'Content-Type': 'multipart/form-data'
        };


        // get revision from database with HEAD
        this.db.head(documentId, (err, data, response) => {
            if (response != 200) {
                return callback(this.boom.create(response, 'document was not found'));
            }
            if (err) {
                return callback(err);
            }

            var idData = {
                _id: documentId,
                _rev: data.etag.split('"')[1]
            };

            // create read stream and pipe it
            var writeStream = this.db.saveAttachment(idData, attachmentData, callback);

            readStream.pipe(writeStream);
        });


    }
}