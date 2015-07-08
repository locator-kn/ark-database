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
     * Returns all locations, which are not deleted
     * @returns {*}
     */
    getAllLocations = () => {
        return this.util.retrieveAllValues(this.LISTS.LIST_LOCATION_LOCATION, undefined);
    };
    /**
     * Returns a list of location from a particular  user.
     * @param userid
     * @param callback
     */
    getLocationsByUserId = (userid:string) => {
        return new Promise((resolve, reject) => {
            var options = {
                key: userid,
                include_docs: true
            };
            this.db.view('location/locationByUser', options, (err, res)=> {
                if (err) {
                    return reject(this.boom.badRequest(err));
                }
                resolve(this.reduceData(res))
            })
        });
    };

    /**
     * Returns THE defaultlocation.
     */
    getDefaultLocation = () => {
        return new Promise((resolve, reject) => {
            this.db.get(DEFAULT_LOCATION, (err, res) => {

                if (err) {
                    return reject(this.boom.badRequest(err))
                }
                resolve(res);
            })
        })
    };

    /**
     * Get all location of a user, which are public
     * @param userid
     * @returns {*}
     */
    getPublicLocationsByUserId = (userid:string) => {
        return this.util.retrieveAllValues(this.LISTS.LIST_PUBLIC_LOCATION_BY_USER, {key: userid})
    };

    /**
     * Get all preLocation (unfinished) of a certain user
     * @param userid
     * @returns {*}
     */
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
        return this.util.retrieveSingleValue(this.LISTS.LIST_LOCATION_LOCATION, locationid);
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

    /**
     * Returns a Promise with all locations from a certain city.
     * @param city
     * @returns {*}
     */
    getLocationsByCity = (city:string) => {
        return this.util.retrieveAllValues(this.LISTS.LIST_PUBLIC_LOCATION_BY_CITY, {key: city});
    };

    /**
     * Get all "my" locations from a city (including private ones)
     * @param city
     * @param userid
     * @returns {*}
     */
    getLocationsByCityAndUser = (city:string, userid:string) => {
        return this.util.retrieveAllValues(this.LISTS.LIST_LOCATION_BY_CITY_AND_USER, {key: [city, userid]})
    };

    /**
     * Returns all location, which are in a certain trip
     * @param tripid
     * @returns {any}
     */
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

    /**
     * Checks if the location is in any trip and returns true if not.
     * @param locationid
     * @returns {any}
     */
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
        return new Promise((resolve, reject) => {

            this.db.get(locationid, (err, res) => {

                if (err) {
                    return reject(this.boom.badRequest(err));
                }

                if (!res.type || res.type !== this.TYPE) {
                    return reject(this.boom.notAcceptable('Wrong document type'));
                }

                if (!res.userid || res.userid !== userid) {
                    // check if it is the default Location
                    if (locationid === DEFAULT_LOCATION) {
                        return this.deleteDefaultLocationFromUser(userid);
                    }
                    return reject(this.boom.forbidden('Wrong user'));
                }

                if (res.delete) {
                    return reject(this.boom.notFound('deleted'));
                }

                this.db.merge(locationid, {delete: true, deleteDate: new Date()}, (err, result) => {

                    if (err) {
                        return reject(this.boom.badRequest(err));
                    }
                    return resolve(result);
                });
            });
        });
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

    deleteDefaultLocationFromUser = (userid:string) => {
        return new Promise((resolve, reject) => {

            this.db.get(userid, (err, result) => {

                if (err) {
                    return reject(this.boom.badRequest(err));
                }

                if (!result.defaultLocation) {
                    return reject(this.boom.notFound('already deleted'));
                }

                var id = result._id;
                var rev = result._rev;

                delete result.defaultLocation;
                delete result._id;
                delete result._rev;

                this.db.save(id, rev, result, (err, result) => {

                    if (err) {
                        return reject(this.boom.badRequest(err));
                    }

                    resolve(result);
                })
            })
        })
    };

    reduceData = (data:any) => {
        var r = [];

        data.forEach(function (value) {
            r.push(value)
        });

        return r
    }
}