declare
var Promise:any;

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
            //TODO: log error with good
            if (err) {
                console.log(err)
            }
        }));

    };

    /**
     * Saves an attachment and returns a Promise
     * @param documentId
     * @param filename
     * @param readStream
     * @param callback
     */
    savePicture = (documentId:string, attachmentData:any, readStream:any) => {

        return new Promise((resolve, reject) => {

            // get revision from database with HEAD
            this.db.head(documentId, (err, data, response) => {
                if (response != 200) {
                    return reject(this.boom.create(response, 'document was not found'));
                }
                if (err) {
                    return reject(err);
                }

                var idData = {
                    _id: documentId,
                    _rev: data.etag.split('"')[1] // remove quotes to get revision
                };

                // create read stream and pipe it
                var writeStream = this.db.saveAttachment(idData, attachmentData, (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(result)
                    }
                );

                readStream.pipe(writeStream);
            });
        });

    }
}
