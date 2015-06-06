export default
class StaticData {
    constructor(private db:any, private LISTS:any) {

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
        var date = new Date();
        mood.create_date = date.toISOString();
        this.db.save(mood, callback);
    };

    /**
     * Create a new City.
     *
     * @param city:json-object
     * @param callback
     */
    createCity = (city, callback) => {
        var date = new Date();
        city.create_date = date.toISOString();
        this.db.save(city, callback);
    };

    /**
     * Create a new accommodation.
     *
     * @param accommodations:json-object
     * @param callback
     */
    createAccommodation = (accommodations, callback) => {
        var date = new Date();
        accommodations.create_date = date.toISOString();
        this.db.save(accommodations, callback);
    };

    /**
     * Create a new accommodation equipment.
     *
     * @param accommodationsEquipment:json-object
     * @param callback
     */
    createAccommodationEquipment = (accommodationsEquipment, callback) => {
        var date = new Date();
        accommodationsEquipment.create_date = date.toISOString();
        this.db.save(accommodationsEquipment, callback);
    };

    // UPDATE

    /**
     * Update mood information.
     *
     * @param moodId:string
     * @param rev:string
     * @param mood:Mood
     * @param callback
     */
    updateMood = (moodId:string, rev:string, mood, callback) => {
        var date = new Date();
        mood.modified_date = date.toISOString();
        this.db.save(moodId, rev, mood, callback);
    };

    /**
     * Update city information.
     *
     * @param cityId:string
     * @param rev:string
     * @param city:City
     * @param callback
     */
    updateCity = (cityId:string, rev:string, city, callback) => {
        var date = new Date();
        city.modified_date = date.toISOString();
        this.db.save(cityId, rev, city, callback);
    };


    /**
     * Update accommodations information.
     *
     * @param accommodationsId:string
     * @param rev:string
     * @param accommodations:Accommodations
     * @param callback
     */
    updateAccommodation = (accommodationsId:string, rev:string, accommodations, callback) => {
        var date = new Date();
        accommodations.modified_date = date.toISOString();
        this.db.save(accommodationsId, rev, accommodations, callback);
    };

    /**
     * Update accommodationsEquipment information.
     *
     * @param accommodationsEquipmentId:string
     * @param rev:string
     * @param accommodationsEquipment:accommodationsEquipment
     * @param callback
     */
    updateAccommodationEquipment = (accommodationsEquipmentId:string, rev:string, accommodationsEquipment, callback) => {
        var date = new Date();
        accommodationsEquipment.modified_date = date.toISOString();
        this.db.save(accommodationsEquipmentId, rev, accommodationsEquipment, callback);
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