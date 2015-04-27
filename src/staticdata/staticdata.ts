export default
class StaticData {
    constructor(private db: any, private VIEWS: any) {

    }

    /**
     * Get moods from database.
     *
     * @param callback
     */
    getMoods = (callback) => {
        this.db.view(this.VIEWS.VIEW_DATA_MOODS, callback);
    };

    /**
     * Get cities from database.
     *
     * @param callback
     */
    getCities = (callback) => {
        this.db.view(this.VIEWS.VIEW_DATA_CITY, callback);
    };

    /**
     * Get accommodations from database.
     *
     * @param callback
     */
    getAccommodations = (callback) => {
        this.db.view(this.VIEWS.VIEW_DATA_ACC, callback);
    };




}