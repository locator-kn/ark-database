import Util from './../util/util';

export default
class StaticData {
    private util:any;

    constructor(private db:any, private LISTS:any) {
        this.util = new Util(db);
    }

    // GET

    /**
     * Get moods from database.
     *
     * @param callback
     */
    getMoods = (callback) => {
        this.db.list(this.LISTS.LIST_DATA_MOOD, callback);
    };

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
    getCitiesWithTrips = (callback) => {
        this.db.list(this.LISTS.LIST_DATA_CITY_TRIPS, {reduce: true, group: true}, callback);
    };

    /**
     * Get accommodations from database.
     *
     * @param callback
     */
    getAccommodations = (callback) => {
        this.db.list(this.LISTS.LIST_DATA_ACC, callback);
    };


    /**
     * Get accommodations equipment from database.
     *
     * @param callback
     */
    getAccommodationsEquipment = (callback) => {
        this.db.list(this.LISTS.LIST_DATA_ACC_EQUIPMENT, callback);
    };


    // CREATE

    /**
     * Create a new Mood.
     *
     * @param mood:json-object
     * @param callback
     */
    createMood = (mood, callback) => {
        this.util.createDocument(mood, callback);
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
     * Create a new accommodation.
     *
     * @param accommodations:json-object
     * @param callback
     */
    createAccommodation = (accommodations, callback) => {
        this.util.createDocument(accommodations, callback);
    };

    /**
     * Create a new accommodation equipment.
     *
     * @param accommodationsEquipment:json-object
     * @param callback
     */
    createAccommodationEquipment = (accommodationsEquipment, callback) => {
        this.util.createDocument(accommodationsEquipment, callback);
    };

    // UPDATE

    /**
     * Update mood information.
     *
     * @param moodId:string
     * @param mood:Mood
     * @param callback
     */
    updateMood = (moodId:string, mood, callback) => {
        this.util.updateDocumentWithCallback(moodId, mood, callback);
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
     * Update accommodations information.
     *
     * @param accommodationsId:string
     * @param accommodations:Accommodations
     * @param callback
     */
    updateAccommodation = (accommodationsId:string, accommodations, callback) => {
        this.util.updateDocumentWithCallback(accommodationsId, accommodations, callback);
    };

    /**
     * Update accommodationsEquipment information.
     *
     * @param accommodationsEquipmentId:string
     * @param accommodationsEquipment:accommodationsEquipment
     * @param callback
     */
    updateAccommodationEquipment = (accommodationsEquipmentId:string, accommodationsEquipment, callback) => {
        this.util.updateDocumentWithCallback(accommodationsEquipmentId, accommodationsEquipment, callback);
    };

    /**
     * Delete a particular mood by id.
     *
     * @param moodId:string
     * @param callback
     */
    deleteMoodById = (moodId:string, callback) => {
        this.db.remove(moodId, callback);
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

    /**
     * Delete a particular accommodations by id.
     *
     * @param accommodationsId:string
     * @param callback
     */
    deleteAccommodationById = (accommodationsId:string, callback) => {
        this.db.remove(accommodationsId, callback);
    };

    /**
     * Delete a particular accommodations equipment by id.
     *
     * @param accommodationsEquipmentId:string
     * @param callback
     */
    deleteAccommodationEquipmentById = (accommodationsEquipmentId:string, callback) => {
        this.db.remove(accommodationsEquipmentId, callback);
    };

}