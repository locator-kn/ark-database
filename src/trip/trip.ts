export default
class Trip {
    constructor(private db: any, private VIEWS: any) {

    }

    /**
     * Get trips from database.
     *
     * @param callback
     */
    getTrips = (callback) => {
        this.db.view(this.VIEWS.VIEW_TRIP_TRIP, callback);
    };

    /**
     * Get trip from database by specific trip id.
     *
     * @param tripid:string
     * @param callback
     */
    getTripById = (tripid:string, callback) => {
        this.db.view(this.VIEWS.VIEW_TRIP_TRIP, {key: tripid}, callback);
    };

    /**
     * Update user information.
     *
     * @param userId
     * @param rev
     * @param user
     * @param callback
     */
    updateTrip = (tripId:string, rev:string, trip, callback) => {
        this.db.save(tripId, rev, trip, callback);
    };
}