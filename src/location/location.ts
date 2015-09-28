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
     * Returns all locations, which are not deleted
     * @returns {*}
     */
    getAllLocationsPaged = (query) => {
        var options = {
            include_docs: true,
            descending: true,
        };

        return this.util.getPagedResults('location/getAllLocationsPaged', query.elements, query.page, options)
            .then(val => {
                return Promise.resolve(this._reduceData(val));
            });
    };


    getLocationsBySearchQuery = (place_id, category_query_name) => {
        if (!category_query_name) {
            category_query_name = null;
        }
        var options = {
            key: [place_id, category_query_name],
            include_docs: true
        };

        return this.util.getPagedResults('location/placeIdCategoryId', null, -1, options)
            .then(val => {
                return this._reduceData(val);
            });
        //return this.util.retrieveAllValues('location/listall/placeIdCategoryId', options);
    };

    /**
     * Returns a list of location from a particular  user.
     * @param userid
     */
    getLocationsByUserId = (userid:string, query:any) => {
        var options = {
            key: userid,
            include_docs: true
        };

        return this.util.getPagedResults('location/locationByUser', query.elements, query.page, options)
            .then(val => {
                var result = this._reduceData(val);

                // provide default location on top
                // TODO: needs to discussed
                result.sort((a:any, b)=> {
                    if (a._id === DEFAULT_LOCATION) {
                        return 0;
                    } else {
                        return 1;
                    }
                });

                return Promise.resolve(result)
            })
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
    getPublicLocationsByUserId = (userid:string, query) => {
        if (!query.elements) {
            return this.util.retrieveAllValues(this.LISTS.LIST_PUBLIC_LOCATION_BY_USER, {key: userid})
        } else {
            var options:any = {
                key: userid
            };
            return this.util.getPagedResults('location/publicLocationByUser', query.elements, query.page, options)
                .then(val => {
                    return Promise.resolve(this._reduceData(val));
                })
        }
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
     * Returns a Promise with all locations from a certain city.
     * @param city
     * @returns {*}
     */
    getLocationsByCity = (city:string) => {
        return this.util.retrieveAllValues(this.LISTS.LIST_PUBLIC_LOCATION_BY_CITY, {key: city});
    };

    /**
     * Returns a location paginated with elements and page
     * @param city
     * @param query
     */
    getPagedLocationsByCity = (city:string, query:any) => {
        var options = {
            key: city,
            include_docs: true,
            limit: query.elements,
            skip: query.elements * query.page
        };

        return new Promise((resolve, reject) => {
            this.db.view('location/pagedLocationsByCity', options, (err, res) => {

                if (err) {
                    return reject(this.boom.badRequest(err));
                }

                resolve(this._reduceData(res));
            })

        })

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
                resolve(this._reduceData(result))
            })
        })

    };

    /**
     * Returns related location to the given one
     * @param locationid
     * @param number
     */
    getRelatedLocations = (locationid:string, number:number) => {

        // first get the city of location
        return this.util.getDocument(locationid)
            .then(value => {
                // get all locations from city TODO: find better solution, not scalable
                return this.getLocationsByCity(value.city.place_id);
            }).then(locations => {
                // get "number" random elements and return them

                var length = locations.length;
                var resultArray = [];

                // remove original location and return array without random selections
                if (length <= number + 1) {
                    return Promise.resolve(this._removeEntryById(locations, locationid));
                }

                for (var i = 0; i < number; i++) {
                    var randomIndex = Math.floor(Math.random() * (length - i - 1));

                    if (locations[randomIndex]._id === locationid) {
                        if (randomIndex === 0) {
                            randomIndex++;
                        } else {
                            randomIndex--;
                        }
                    }

                    resultArray.push(locations[randomIndex]);

                    // remove entry to avoid duplicate entries in result array
                    locations.splice(randomIndex, 1);
                }

                return Promise.resolve(resultArray)
            })
    };

    /**
     * Checks if the location is in any trip and returns true if not.
     * @param locationid
     * @returns {any}
     */
    isLocationNotInUse = (locationid:string) => {
        return new Promise((resolve, reject) => {

            // resolve if its the default location (special case)
            if (locationid === DEFAULT_LOCATION) {
                return resolve();
            }

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
     */
    deleteLocationById = (locationid:string, userid:string) => {

        // check if it is the default Location
        if (locationid === DEFAULT_LOCATION) {
            return this._deleteDefaultLocationFromUser(userid);
        }

        return new Promise((resolve, reject) => {

            this.db.get(locationid, (err, res) => {

                if (err) {
                    return reject(this.boom.badRequest(err));
                }

                if (!res.type || res.type !== this.TYPE) {
                    return reject(this.boom.notAcceptable('Wrong document type'));
                }

                if (!res.userid || res.userid !== userid) {
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
     */
    createLocation = (location) => {
        return this.util.createDocument(location);
    };

    /**
     * Updates a location of a user.
     * @param locationId
     * @param location
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

    _deleteDefaultLocationFromUser = (userid:string) => {
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

    _reduceData = (data:any) => {
        var r = [];

        data.forEach(function (value) {
            r.push(value)
        });

        return r
    };

    _removeEntryById = (array:any, id:string) => {
        for (var j = 0; j < array.length; j++) {
            if (array[j]._id === id) {
                array.splice(j, 1)
            }
        }
        return array;
    }
}