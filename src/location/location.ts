export default
class Location {
    constructor(private db:any, private VIEWS:any) {
    }

    /**
     * Returns a list of location from a particular  user.
     * @param userid
     * @param callback
     */
    getLocationsByUserId = (userid:string, callback) => {
        //TODO
    };

    /**
     * Returns a particular location from a location pool of a user.
     * @param locationid
     * @param callback
     */
    getLocationById = (locationid:string, callback) => {
        //TODO
    };

    /**
     * Deletes the entire location pool of a user.
     * @param userid
     * @param callback
     */
    deleteLocationsByUserId = (userid:string, callback) => {
        //TODO
    };

    /**
     * Deletes a particular location
     * @param locationid
     * @param callback
     */
    deleteLocationById = (locationid:string, callback) => {
        //TODO
    };

    /**
     * Creates a new location and adds it to the location pool of a user.
     * @param location
     * @param callback
     */
    createLocation = (location, callback) => {
        this.db.save(location, callback);
    };

    /**
     * Updates a location of a user.
     * @param locationid
     * @param rev
     * @param callback
     */
    updateLocation = (locationid:string, rev:string, callback) => {
        //TODO
    };
}