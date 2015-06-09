declare
var Promise:any;

import Util from './../util/util';

export default
class Location {
    private util:any;
    private TYPE:string = 'location';

    constructor(private db:any, private LISTS:any) {
        this.util = new Util(db);
    }

    /**
     * Returns a list of location from a particular  user.
     * @param userid
     * @param callback
     */
    getLocationsByUserId = (userid:string) => {
        return new Promise((resolve, reject) => {

            this.db.list(this.LISTS.LIST_LOCATION_USER, {key: userid}, (err, data) => {

                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        })
    };

    getPreLocationsByUserId = (userid:string) => {
        return new Promise((resolve, reject) => {

            this.db.list(this.LISTS.LIST_LOCATION_PRELOCATION_USER, {key: userid}, (err, data) => {

                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        })
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
        return this.util.updateDocument(locationid, userid, location, this.TYPE);
    };
}