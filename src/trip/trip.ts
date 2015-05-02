export default
class Trip {
    constructor(private db:any, private LISTS:any) {
    }

    /**
     * Get trips from database.
     *
     * @param callback
     */
    getTrips = (callback) => {
        this.db.list(this.LISTS.LIST_TRIP_ALL, callback);
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
     * Update trip information.
     *
     * @param tripId:string
     * @param rev:string
     * @param trip:Trip
     * @param callback
     */
    updateTrip = (tripId:string, rev:string, trip, callback) => {
        this.db.save(tripId, rev, trip, callback);
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
     * Delete a particular trip by id.
     *
     * @param tripId:string
     * @param callback
     */
    deleteTripById = (tripId:string, callback) => {
        this.db.remove(tripId, callback);
    };
}