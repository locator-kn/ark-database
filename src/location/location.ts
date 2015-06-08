import Util from './../util/util';

export default
class Location {
    private util:any;

    constructor(private db:any, private LISTS:any) {
        this.util = new Util(db);
    }

    /**
     * Returns a list of location from a particular  user.
     * @param userid
     * @param callback
     */
    getLocationsByUserId = (userid:string, callback) => {
        this.db.list(this.LISTS.LIST_LOCATION_USER, {key: userid}, callback);
    };

    /**
     * Returns a particular location from a location pool of a user.
     * @param locationid
     * @param callback
     */
    getLocationById = (locationid:string, callback) => {
        this.db.list(this.LISTS.LIST_LOCATION_LOCATION, {key: locationid}, callback);
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
    deleteLocationById = (locationid:string, callback) => {
        this.db.remove(locationid, callback);
    };

    /**
     * Creates a new location and adds it to the location pool of a user.
     * @param userid
     * @param location
     * @param callback
     */
    createLocation = (userid:string, location, callback) => {
        this.util.createDocument(location, callback);
    };

    /**
     * Updates a location of a user.
     * @param locationId
     * @param location
     * @param callback
     */
    updateLocation = (locationId:string, location, callback) => {
        this.util.updateDocumentWithCallback(locationId, location, callback);
    };
}