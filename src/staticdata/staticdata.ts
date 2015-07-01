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
     * Get cities from database.
     *
     * @param callback
     */
    getCities = (callback) => {
        this.db.list(this.LISTS.LIST_DATA_CITY, callback);
    };

    /**
     * Get cities with trips
     * @param callback
     */
    getCitiesWithTrips = () => {
        return this.util.retrieveAllValues(this.LISTS.LIST_DATA_CITY_TRIPS, {reduce: true, group: true});
    };


    /**
     * Create a new City.
     *
     * @param city:json-object
     * @param callback
     */
    createCity = (city, callback) => {
        this.util.createDocument(city, callback);
    };


    /**
     * Update city information.
     *
     * @param cityId:string
     * @param city:City
     * @param callback
     */
    updateCity = (cityId:string, city, callback) => {
        this.util.updateDocumentWithCallback(cityId, city, callback);
    };


    /**
     * Delete a particular city by id.
     *
     * @param cityId:string
     * @param callback
     */
    deleteCityById = (cityId:string, callback) => {
        this.db.remove(cityId, callback);
    };

    
}