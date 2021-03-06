import Util from './../util/util';
import {log} from './../logging/logging'
declare var Promise:any;

export default
class Trip {
    private util:any;
    private TYPE:string = 'trip';
    private boom:any;

    constructor(private db:any, private LISTS:any) {
        this.util = new Util(db);
        this.boom = require('boom');
    }

    /**
     * get all trip documents, which are not deleted
     */
    getAllTrips = () => {
        return this.util.retrieveAllValues(this.LISTS.LIST_TRIP_ALL, undefined);
    };

    /**
     * Get trips from database.
     *
     * @param paginationOptions
     * @param callback
     */
    getTrips = (paginationOptions, callback) => {
        this.db.list(this.LISTS.LIST_TRIP_ALL, paginationOptions, callback);
    };

    /**
     * Get trip from database by specific trip id.
     *
     * @param tripid:string
     */
    getTripById = (tripid:string) => {
        return this.util.retrieveSingleValue(this.LISTS.LIST_TRIP_ALL, tripid);
    };

    /**
     * Get trip from database by specific city name.
     *
     * @param city:string
     * @param callback
     */
    getTripsByCity = (city:string, callback) => {
        this.db.list(this.LISTS.LIST_TRIP_CITY, {key: city}, callback);
    };

    /**
     * Get trip from database by query.
     *
     * @param query
     * @param callback
     */
    searchTripsByQuery = (query, callback) => {
        this.db.list(this.LISTS.LIST_SEARCH_TRIP, query, callback);
    };

    /**
     * Update trip information.
     *
     * @param tripId:string
     * @param trip:Trip
     */
    updateTrip = (tripId:string, userid:string, trip) => {
        return this.util.updateDocument(tripId, userid, trip, this.TYPE);
    };

    /**
     * Create a new trip.
     *
     * @param trip:json-object
     */
    createTrip = (trip) => {
        return this.util.createDocument(trip);
    };


    /**
     * Delete a particular trip by id and returns a Promise
     *
     * @param tripId:string
     */
    deleteTripById = (tripId:string, userid:string) => {
        var promise = this.util.deleteDocument(tripId, userid, this.TYPE);

        // async delete trip from other referenced documents
        this.db.view('chat/conversationsByTripId', {key: tripId}, (err, res) => {
            if (err) {
                log('Error: could not delete trip id from other document: ' + err);
            } else {

                // iterate over each document (conversation) and delete the trip
                res.forEach((value:any) => {
                    var id = value._id;
                    var rev = value._rev;

                    if (value.trip) {
                        delete value.trip;
                        delete value._id;
                        delete value._rev;

                        this.db.save(id, rev, value, (err, result)=> {
                            if (err) {
                                log('Error: could not delete trip from document id:' + id +
                                    'Because of: ' + err);
                            } else {
                                log('Successfully trip deleted')
                            }
                        })
                    }
                })
            }
        });

        return promise;
    };

    /**
     * Change trip into public or private, depending on the status.
     * @param locationid
     * @param userid
     */
    togglePublicTrip = (tripid:string, userid:string) => {
        return this.util.togglePublic(tripid, userid, this.TYPE);
    };

    /**
     * Update the url of a location in a trip document
     * @param locationid
     * @param userid
     * @param imageLocation
     */
    updateTripsWithLocationImage = (locationid:string, userid:string, imageLocation:any) => {

        this.db.list(this.LISTS.LIST_TRIP_BY_LOCATION, {key: locationid}, (err, result) => {

            if (err) {
                return new Promise((resolve, reject)=> {
                    return reject(this.boom.badRequest(err));
                });
            }

            var newLocation = {
                locations: {}
            };

            newLocation.locations[locationid] = imageLocation;

            return Promise.all(result.map(trip => {
                return this.util.updateDocument(trip.id || trip._id, userid, newLocation, this.TYPE, true)
            }));

        })
    };

    /**
     * Remove a location from all trips containing this location
     * @param locationid
     * @param userid
     */
    removeLocationFromTrips = (locationid:string, userId:string) => {

        // get all trips, containing this location
        this.db.list(this.LISTS.LIST_TRIP_BY_LOCATION, {key: locationid}, (err, result) => {

            if (err) {
                return new Promise((resolve, reject)=> {
                    return reject(this.boom.badRequest(err));
                });
            }

            // remove all locations from all trips
            return Promise.all(result.map((trip:any) => {

                return new Promise((resolve, reject) => {

                    if (!trip.userid || trip.userid !== userId) {
                        return reject(this.boom.forbidden());
                    }

                    delete trip.locations[locationid];

                    // update modified_date
                    var date = new Date();
                    trip.modified_date = date.toISOString();


                    this.db.merge(trip._id, trip, (err, result) => {
                        if (err) {
                            return reject(this.boom.badRequest(err));
                        }
                        return resolve(result);
                    });
                })
            }))
        })
    };

    /**
     * Get all trips for this user id.
     * @param userid
     */
    getUserTrips = (userid:string, date:any, query:any) => {
        var opt = {
            startkey: [userid, date || null],
            endkey: [userid, {}]
        };
        return this.util.getPagedResults('trip/tripByUserId/', query.elements, query.page, opt)
            .then(val => {
                return Promise.resolve(this.reduceData(val));
            });
    };

    /**
     * Get all trips of with the specific userid, optional paged and within a certain date
     * @param userid
     * @param date
     * @param query
     * @returns {Promise<U>|Promise<Promise<void>|Promise<R>|Promise<Array>|void|string|string[]>|Thenable<U>|Thenable<Promise<void>|Promise<R>|Promise<Array>|void|string|string[]>}
     */
    getMyTrips = (userid:string, date:any, query:any) => {
        var opt = {
            startkey: [userid, date || null],
            endkey: [userid, {}]
        };
        return this.util.getPagedResults('trip/myTrips/', query.elements, query.page, opt)
            .then(val => {
                return Promise.resolve(this.reduceData(val));
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