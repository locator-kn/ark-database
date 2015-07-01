declare var Promise:any;

import Util from './../util/util';

export default
class StaticData {
    private util:any;

    constructor(private db:any, private LISTS:any) {
        this.util = new Util(db);
    }

    // GET

    /**
     * Get cities with trips
     * @param callback
     */
    getCitiesWithTrips = () => {
        return this.util.retrieveAllValues(this.LISTS.LIST_DATA_CITY_TRIPS, {reduce: true, group: true});
    };

    /**
     * Get all tags which are used in locations
     * @returns {*}
     */
    getAllTagsFromLocations = () => {
        return this.util.retrieveAllValues(this.LISTS.LIST_LOCATION_TAGS);
    }


}