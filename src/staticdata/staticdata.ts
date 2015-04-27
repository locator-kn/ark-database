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

}