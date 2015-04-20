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
}