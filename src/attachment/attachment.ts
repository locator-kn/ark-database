declare
var Promise:any;

export default
class Attachment {
    Readable:any;
    stream:any;
    boom:any;

    constructor(private db:any) {
        this.stream = require('stream');
        this.Readable = this.stream.Readable || require('readable-stream').Readable;
        this.boom = require('boom');
    }

    /**
     * Returns the picture (attachment) with that name to that corresponding document
     * @param documentid
     * @param filename
     * @param callback
     */
    getPicture = (documentid:string, filename:string, callback) => {
        // TODO: callback?
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
     * @param attachmentData
     * @param readStream
     */
    savePicture = (documentId:string, attachmentData:any, readStream:any) => {

        return new Promise((resolve, reject) => {

            // get revision from database with HEAD
            this.db.head(documentId, (err, headers, res) => {
                if (res === 404 || !headers['etag']) {
                    return reject(this.boom.create(404, "document not found"));
                }

                if (err) {
                    return reject(err);
                }

                var idData = {
                    _id: documentId,
                    _rev: headers['etag'].slice(1, -1)// remove quotes to get revision
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
