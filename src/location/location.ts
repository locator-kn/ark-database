declare var Promise:any;

import Util from './../util/util';
import Attachment from './../attachment/attachment';
import {DEFAULT_LOCATION} from '../plugin';
var fse = require('fs-extra');
var path = require('path');

export default
class Location {
    private util:any;
    private TYPE:string = 'location';
    private boom:any;
    private hoek:any;
    private attachment:any;

    constructor(private db:any, private LISTS:any) {
        this.util = new Util(db);
        this.boom = require('boom');
        this.hoek = require('hoek');
        this.attachment = new Attachment(db);
    }

    /**
     * Returns a list of location from a particular  user.
     * @param userid
     * @param callback
     */
    getLocationsByUserId = (userid:string) => {
        return this.util.retrieveAllValues(this.LISTS.LIST_LOCATION_USER, {key: userid});
    };

    /**
     * Get all location of a user, which are public
     * @param userid
     * @returns {*}
     */
    getPublicLocationsByUserId = (userid:string) => {
        return this.util.retrieveAllValues(this.LISTS.LIST_PUBLIC_LOCATION_BY_USER, {key: userid})
    };

    getPreLocationsByUserId = (userid:string) => {
        return this.util.retrieveAllValues(this.LISTS.LIST_LOCATION_PRELOCATION_USER, {key: userid});
    };

    /**
     * Returns a particular location from a location pool of a user.
     * @param locationid
     * @param callback
     */
    getLocationById = (locationid:string) => {
        // don't return deleted locations
        return this.util.retrieveSingleValue(locationid, this.LISTS.LIST_LOCATION_LOCATION);
    };

    /**
     * Change location into public or private, depending on the status.
     * @param locationid
     * @param userid
     */
    togglePublicLocation = (locationid:string, userid:string) => {
        return this.util.togglePublic(locationid, userid, this.TYPE);
    };

    /**
     * Deletes the entire location pool of a user.
     * @param userid
     * @param callback
     */
    deleteLocationsByUserId = (userid:string, callback) => {
        callback({
            error: 'not implemented yet!'
        });
    };

    getLocationsByCity = (city:string) => {
        return this.util.retrieveAllValues(this.LISTS.LIST_PUBLIC_LOCATION_BY_CITY, {key: city});
    };

    getLocationsByCityAndUser = (city:string, userid:string) => {
        return this.util.retrieveAllValues(this.LISTS.LIST_LOCATION_BY_CITY_AND_USER, {key: [city, userid]})
    };

    getLocationsByTripId = (tripid:string) => {
        return new Promise((resolve, reject) => {
            this.db.view('location/locationByTrip', {key: tripid, include_docs: true}, (err, result) => {
                if (err) {
                    return reject(this.boom.badRequest(err))
                }
                resolve(this.reduceData(result))
            })
        })

    };

    isLocationNotInUse = (locationid:string) => {
        return new Promise((resolve, reject) => {

            this.db.list(this.LISTS.LIST_TRIP_BY_LOCATION, {key: locationid}, (err, result)=> {

                if (err) {
                    return reject(this.boom.badRequest(err))
                }

                if (result.length) {
                    return reject(this.boom.conflict('Location in use'));
                }

                resolve();
            });
        })
    };

    /**
     * Deletes a particular location
     * @param locationid
     * @param callback
     */
    deleteLocationById = (locationid:string, userid:string) => {
        return this.util.deleteDocument(locationid, userid, this.TYPE)
    };

    /**
     * Creates a new location and adds it to the location pool of a user.
     * @param userid
     * @param location
     * @param callback
     */
    createLocation = (location) => {
        return this.util.createDocument(location);
    };

    /**
     * Updates a location of a user.
     * @param locationId
     * @param location
     * @param callback
     */
    updateLocation = (locationid:string, userid:string, location) => {
        return this.util.updateDocument(locationid, userid, location, this.TYPE, true);
    };

    /**
     * Adds the default location to a user profile
     * @param userid
     */
    addDefaultLocationToUser = (userid:string) => {
        return new Promise((resolve, reject)=> {

            this.db.merge(userid, {defaultLocation: DEFAULT_LOCATION}, (err, data) => {

                if (err) {
                    return reject(this.boom.badRequest(err))
                }
                resolve(data)
            })
        });
    };

    reduceData = (data:any) => {
        var r = [];

        data.forEach(function (value) {
            r.push(value)
        });

        return r
    }
}