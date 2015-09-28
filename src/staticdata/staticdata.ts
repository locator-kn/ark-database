declare var Promise:any;

import Util from './../util/util';
import {DEFAULT_LOCATION} from '../plugin'

export default
class StaticData {
    private util:any;
    private boom:any;

    constructor(private db:any, private LISTS:any) {
        this.util = new Util(db);
        this.boom = require('boom');
    }

    // GET

    /**
     * Get cities with trips
     */
    getCitiesWithTrips = () => {
        return this.util.retrieveAllValues(this.LISTS.LIST_DATA_CITY_TRIPS, {reduce: true, group: true});
    };


    getCitiesWithLocations = () => {
        return this.util.retrieveAllValues(this.LISTS.LIST_DATA_CITY_LOCATIONS, {reduce: true, group: true});
    };

    /**
     * Get all tags which are used in locations
     * @returns {*}
     */
    getAllTagsFromLocations = () => {
        return this.util.retrieveAllValues(this.LISTS.LIST_LOCATION_TAGS);
    };

    getDefaultLocation = () => {
        return new Promise((resolve,reject) => {
           this.db.get(DEFAULT_LOCATION, (err,result) => {

               if(err) {
                   return reject(this.boom.badRequest(err))
               }

               resolve(result)
           })
        });
    }


}