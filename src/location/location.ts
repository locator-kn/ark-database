declare var Promise:any;

import Util from './../util/util';

export default
class Location {
    private util:any;
    private TYPE:string = 'location';
    private boom:any;
    private hoek:any;

    constructor(private db:any, private LISTS:any) {
        this.util = new Util(db);
        this.boom = require('boom');
        this.hoek = require('hoek');
    }

    /**
     * Returns a list of location from a particular  user.
     * @param userid
     * @param callback
     */
    getLocationsByUserId = (userid:string) => {
        return this.util.retrieveAllValues(this.LISTS.LIST_LOCATION_USER, {key: userid});
    };

    getPreLocationsByUserId = (userid:string) => {
        return this.util.retrieveAllValues(this.LISTS.LIST_LOCATION_PRELOCATION_USER, {key: userid});
    };

    /**
     * Returns a particular location from a location pool of a user.
     * @param locationid
     * @param callback
     */
    getLocationById = (locationid:string) => {
        return this.util.retrieveSingleValue(locationid, this.LISTS.LIST_LOCATION_LOCATION);
    };

    /**
     * Deletes the entire location pool of a user.
     * @param userid
     * @param callback
     */
    deleteLocationsByUserId = (userid:string, callback) => {
        callback({
            error: 'not implemented yet!'
        });
    };

    /**
     * Deletes a particular location
     * @param locationid
     * @param callback
     */
    deleteLocationById = (locationid:string, userid:string) => {
        return this.util.deleteDocument(locationid, userid, this.TYPE)
    };

    /**
     * Creates a new location and adds it to the location pool of a user.
     * @param userid
     * @param location
     * @param callback
     */
    createLocation = (location) => {
        return this.util.createDocument(location);
    };

    /**
     * Updates a location of a user.
     * @param locationId
     * @param location
     * @param callback
     */
    updateLocation = (locationid:string, userid:string, location) => {
        return new Promise((resolve, reject) => {

            this.db.get(locationid, (err, res) => {

                if (err) {
                    return reject(this.boom.badRequest(err));
                }

                if (!res.type || res.type !== this.TYPE) {
                    return reject(this.boom.notAcceptable('Wrong document type'));
                }

                if (!res.userid || res.userid !== userid) {
                    return reject(this.boom.forbidden('Wrong user'));
                }

                // update modified_date
                var date = new Date();
                location.modified_date = date.toISOString();

                // deep merge of values before merge into database
                var mergedLocation = this.hoek.merge(res, location);

                this.db.merge(locationid, mergedLocation, (err, result) => {

                    if (err) {
                        return reject(this.boom.badRequest(err));
                    }
                    return resolve(result);
                });
            });
        });
    };
}