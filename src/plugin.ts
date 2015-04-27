import User from './user/user';
import Trip from './trip/trip'
import StaticData from './staticdata/staticdata'

export interface IRegister {
    (server:any, options:any, next:any): void;
    attributes?: any;
}

/**
 * database plugin
 *
 * example calls:
 *
 *      // local database (default)
 *      new Database('tripl');
 *
 *      // iriscouch online
 *      new Database('tripl','http://emily.iriscouch.com',80);
 */
export default
class Database {
    private db:any;
    private cradle:any;
    private user:any;
    private trip:any;
    private staticdata:any;

    // defines
    private VIEWS = {
        VIEW_USER_LOGIN: 'user/login',
        VIEW_USER_USER: 'user/user',
        VIEW_TRIP_TRIP: 'trip/trip',
        VIEW_DATA_ACC: 'data/acc',
        VIEW_DATA_MOOD: 'data/mood',
        VIEW_DATA_CITY: 'data/city'
    };

    /**
     * Constructor to create a database instance
     *
     * @param database:string
     *      represents the name of the database
     * @param url:string
     *      url to the storage location of the database
     * @param port
     *      port to connect to the storage location
     */
    constructor(database:string, url?:string, port?:number) {
        // register plugin
        this.register.attributes = {
            name: 'ark-database',
            version: '0.1.0'
        };

        // import database plugin
        this.cradle = require('cradle');

        // use specific setup options if committed
        if (url && port) {
            this.cradle.setup({
                host: url,
                port: port
            });
        }
        this.openDatabase(database);
    }

    // open database instance
    private openDatabase = (database:string)=> {
        this.db = new (this.cradle.Connection)().database(database);
        // check if database exists
        if (!this.db) {
            throw new Error('Error: database does not exist!');
        }

        this.user = new User(this.db, this.VIEWS);
        this.trip = new Trip(this.db, this.VIEWS);
        this.staticdata = new StaticData(this.db, this.VIEWS);
    };

    /**
     * exposes functions to other plugins
     * @param server
     */
    exportApi(server) {
        server.expose('db', this.db);
        // user
        server.expose('getUserById', this.user.getUserById);
        server.expose('getUsers', this.user.getUsers);
        server.expose('getUserLogin', this.user.getUserLogin);
        server.expose('createUser', this.user.createUser);
        server.expose('updateUser', this.user.updateUser);
        server.expose('updateUserPassword', this.user.updateUserPassword);
        server.expose('deleteUserById', this.user.deleteUserById);

        // trip
        server.expose('getTrips', this.trip.getTrips);
        server.expose('getTripById', this.trip.getTripById);
        server.expose('updateTrip', this.trip.updateTrip);
        server.expose('createTrip', this.trip.createTrip);
        server.expose('deleteTripById', this.trip.deleteTripById);

        // staticdata mood
        server.expose('getMoods', this.staticdata.getMoods);
        server.expose('createMood', this.staticdata.createMood);
        server.expose('updateMood', this.staticdata.updateMood);
        server.expose('deleteMoodById', this.staticdata.deleteMoodById);

        // staticdata city
        server.expose('getCities', this.staticdata.getCities);
        server.expose('createCity', this.staticdata.createCity);
        server.expose('updateCity', this.staticdata.updateCity);
        server.expose('deleteCityById', this.staticdata.deleteCityById);

        // staticdata city
        server.expose('getAccommodations', this.staticdata.getAccommodations);
        server.expose('createAccommodation', this.staticdata.createAccommodation);
        server.expose('updateAccommodation', this.staticdata.updateAccommodation);
        server.expose('deleteAccommodationById', this.staticdata.deleteAccommodationById);
    }


    register:IRegister = (server, options, next) => {
        server.bind(this);
        this._register(server, options);
        this.exportApi(server);
        next();
    };

    private _register(server, options) {
        // Register
        return 'register';
    }

    errorInit(err) {
        if (err) {
            console.log('Error: init plugin failed:', err);
        }
    }
}
