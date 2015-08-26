declare var Promise:any;

import Util from './../util/util';

export default
class Location {
    private util:any;
    private TYPE:string = 'schoenhiers';
    private boom:any;
    private hoek:any;

    constructor(private db:any, private LISTS:any) {
        this.util = new Util(db);
        this.boom = require('boom');
        this.hoek = require('hoek');
    }

    /**
     * Returns all locations, which are not deleted
     * @returns {*}
     */
    schoenHier = (docIdtoBeMarked:string, userId:string, schoenhierEntity:string) => {

        return this._createSchoenHierDocumentIfNotExists(userId)
        .then(doc => {

                if(!doc[schoenhierEntity]) {
                    doc[schoenhierEntity] = {};
                }

                if(!doc[schoenhierEntity][docIdtoBeMarked]) {
                    this.util.getDocument(docIdtoBeMarked).then((document:any) => {
                        if(!document.schoenhiers) {
                            document.schoenhiers = 0;
                        }
                        document.schoenhiers++;
                        this.util.updateDocument(docIdtoBeMarked, document.userid, document, document.type);
                    });
                } else {
                    return true;
                }

                doc[schoenhierEntity][docIdtoBeMarked] = true;

                // remove couch status property
                delete doc.ok;
                return this.util.updateDocument(doc.id || doc._id, userId, doc, this.TYPE, true);
            })
    };

    nichtMehrSchoenHier = (docIdtoBeMarked:string, userId:string, schoenhierEntity:string) => {
        return this.util.retrieveSingleValue(this.LISTS.LIST_SCHOENHIER_BYUSERID, userId)
            .then((schoenhierDoc:any) => {
                if(schoenhierDoc[schoenhierEntity][docIdtoBeMarked]) {
                    schoenhierDoc[schoenhierEntity][docIdtoBeMarked] = false;
                    // decrement schoenhier value
                    this.util.getDocument(docIdtoBeMarked).then((document:any) => {
                        document.schoenhiers--;
                        return this.util.updateDocument(docIdtoBeMarked, document.userid, document, document.type);
                    });
                } else {
                    return this.boom.badRequest('forever schoenhier');
                }
                return this.util.updateDocument(schoenhierDoc.id || schoenhierDoc._id, userId, schoenhierDoc, this.TYPE, true);
            })
            .catch(err => {
                return this.boom.badRequest(err);
            });
    };

    _createSchoenHierDocumentIfNotExists = (userId:string) => {
        return this.util.retrieveSingleValue(this.LISTS.LIST_SCHOENHIER_BYUSERID, userId)
            .catch(err => {
                var newDoc = {
                    userid: userId,
                    type: this.TYPE
                };
                return this.util.createDocument(newDoc);
            });
    };

    getSchoenHiersByUserId(userId:string) {
        return this.util.retrieveSingleValue(this.LISTS.LIST_SCHOENHIER_BYUSERID, userId);
    }

}