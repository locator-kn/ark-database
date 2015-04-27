export default
class StaticData {
    constructor(private db: any, private VIEWS: any) {

    }

    // GET

    /**
     * Get moods from database.
     *
     * @param callback
     */
    getMoods = (callback) => {
        this.db.view(this.VIEWS.VIEW_DATA_MOOD, callback);
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


    // CREATE

    /**
     * Create a new Mood.
     *
     * @param mood:json-object
     * @param callback
     */
    createMood = (mood, callback) => {
        this.db.save(mood, callback);
    };




}