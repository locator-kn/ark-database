declare var Promise:any;

import Util from './../util/util';
import {logError} from './../logging/logging'

export default
class Attachment {
    Readable:any;
    stream:any;
    boom:any;
    util:any;

    constructor(private db:any) {
        this.stream = require('stream');
        this.Readable = this.stream.Readable || require('readable-stream').Readable;
        this.boom = require('boom');
        this.util = new Util(db);
    }

    /**
     * Returns the picture (attachment) with that name to that corresponding document
     * @param documentid
     * @param filename
     */
    getPicture = (documentid:string, filename:string) => {
        return new this.Readable().wrap(this.db.getAttachment(documentid, filename, (err) => {
            if (err) {
                logError(err)
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
                    return reject(this.boom.badRequest(err));
                }

                var idData = {
                    _id: documentId,
                    _rev: headers['etag'].slice(1, -1)// remove quotes to get revision
                };

                // create read stream and pipe it
                var writeStream = this.db.saveAttachment(idData, attachmentData, (err, result) => {
                        if (err) {
                            return reject(this.boom.badRequest(err));
                        }
                        resolve(result);
                    }
                );

                readStream.pipe(writeStream);
            });
        });

    }
}
