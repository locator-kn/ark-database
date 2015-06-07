import Util from './../util/util';

export default
class Trip {
    private util:any;
    private TYPE:string = 'trip';

    constructor(private db:any, private LISTS:any) {
        this.util = new Util(db);
    }

    /**
     * Get trips from database.
     *
     * @param paginationOptions
     * @param callback
     */
    getTrips = (paginationOptions, callback) => {
        this.db.list(this.LISTS.LIST_TRIP_ALL, paginationOptions, callback);
    };

    /**
     * Get trip from database by specific trip id.
     *
     * @param tripid:string
     * @param callback
     */
    getTripById = (tripid:string, callback) => {
        this.db.list(this.LISTS.LIST_TRIP_ALL, {key: tripid}, callback);
    };

    /**
     * Get trip from database by specific city name.
     *
     * @param city:string
     * @param callback
     */
    getTripsByCity = (city:string, callback) => {
        this.db.list(this.LISTS.LIST_TRIP_CITY, {key: city}, callback);
    };

    /**
     * Get trip from database by query.
     *
     * @param query
     * @param callback
     */
    searchTripsByQuery = (query, callback) => {
        this.db.list(this.LISTS.LIST_SEARCH_TRIP, query, callback);
    };

    /**
     * Update trip information.
     *
     * @param tripId:string
     * @param trip:Trip
     * @param callback
     */
    updateTrip = (tripId:string, userid:string, trip) => {
        return this.util.updateDocument(tripId, userid, trip, this.TYPE);
    };

    /**
     * Create a new trip.
     *
     * @param trip:json-object
     * @param callback
     */
    createTrip = (trip, callback) => {
        this.db.save(trip, callback);
    };


    /**
     * Delete a particular trip by id and returns a Promise
     *
     * @param tripId:string
     * @param callback
     */
    deleteTripById = (tripId:string, userid:string) => {
        return this.util.removeDocument(tripId, userid, this.TYPE);
    };

    /**
     * Get all trips for this user id.
     * @param userid
     * @param callback
     */
    getUserTrips = (userid:string, callback) => {
        this.db.list(this.LISTS.LIST_TRIP_USER, {key: userid}, callback);
    }
}