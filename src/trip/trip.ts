import Util from './../util/util';
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
     * @param callback
     */
    getTripById = (tripid:string, callback) => {
        this.db.list(this.LISTS.LIST_TRIP_ALL, {key: tripid}, callback);
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
     * @param callback
     */
    updateTrip = (tripId:string, userid:string, trip) => {
        return this.util.updateDocument(tripId, userid, trip, this.TYPE);
    };

    /**
     * Create a new trip.
     *
     * @param trip:json-object
     * @param callback
     */
    createTrip = (trip) => {
        return this.util.createDocument(trip);
    };


    /**
     * Delete a particular trip by id and returns a Promise
     *
     * @param tripId:string
     * @param callback
     */
    deleteTripById = (tripId:string, userid:string) => {
        return this.util.deleteDocument(tripId, userid, this.TYPE);
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
    getUserTrips = (userid:string, date:any) => {
        return new Promise((resolve, reject)=> {
            var opt = {
                startkey: [userid, date || ''],
                endkey: [userid, {}]
            };

            this.db.view('trip/tripByUserId/', opt, (err, data) => {

                if (err) {
                    return reject(this.boom.badRequest(err));
                }
                resolve(this.reduceData(data));
            });
        });
    };

    getMyTrips = (userid:string, date:any, callback) => {
        var opt = {
            startkey: [userid, date || ''],
            endkey: [userid, {}]
        };
        this.db.view('trip/myTrips/', opt, (err, data) => {

            if (err) {
                return callback(err);
            }
            callback(null, this.reduceData(data))
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