import User from './user/user';
import Trip from './trip/trip';
import Location from './location/location';
import StaticData from './staticdata/staticdata';
import Attachment from './attachment/attachment';
import Util from './util/util'
import Mail from './mail/mail'
import Chat from './chat/chat'

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
    private location:any;
    private staticdata:any;
    private attachment:any;
    private util:any;
    private mail:any;
    private chat:any;


    // define Lists
    private LISTS = {
        LIST_USER_ALL: 'user/listall/user',
        LIST_USER_LOGIN: 'user/listall/login',
        LIST_USER_UUID: 'user/listall/uuid',
        LIST_LOCATION_USER: 'location/listall/user',
        LIST_LOCATION_LOCATION: 'location/listall/location',
        LIST_SEARCH_TRIP: 'search/searchlist/city',
        LIST_DATA_MOOD: 'data/listall/moods',
        LIST_DATA_ACC: 'data/listall/accommodations',
        LIST_DATA_ACC_EQUIPMENT: 'data/listall/accommodations_equipment',
        LIST_DATA_CITY: 'data/listall/cities',
        LIST_DATA_CITY_TRIPS: 'data/listall/cities_trips',
        LIST_TRIP_ALL: 'trip/listall/trip',
        LIST_TRIP_CITY: 'trip/listall/city',
        LIST_MAIL_REGISTRATION: 'mail/listall/registration',
        LIST_CHAT_CONVERSATIONS: 'chat/listallByUserId/conversationsByUserId',
        LIST_CHAT_CONVERSATIONBYID: 'chat/listall/conversationsById',
        LIST_CHAT_MESSAGESBYCONVERSATIONID: 'chat/listall/messagesByConversationId'
    };

    private VIEWS = {
        USER_LOGIN: 'user/login'
    };

    /**
     * Constructor to create a database instance
     *
     * @param database:string
     *      represents the name of the database
     *
     * @param env:any
     *      env is an object with secrets (password etc)
     * @param url:string
     *      url to the storage location of the database
     * @param port
     *      port to connect to the storage location
     */
    constructor(private database:string, private env:any, url?:string, port?:number) {
        // register plugin
        this.register.attributes = {
            pkg: require('./../../package.json')
        };

        // import database plugin
        this.cradle = require('cradle');

        // use specific setup options if committed
        if (this.env) {
            if (!this.env['COUCH_USERNAME'] || !this.env['COUCH_USERNAME']) {
                throw new Error('database: please set up credentials');
            }
            this.cradle.setup({
                host: url || 'localhost',
                port: port || 5984,
                auth: {
                    username: this.env['COUCH_USERNAME'],
                    password: this.env['COUCH_PASSWORD']
                }
            });
        }
        this.openDatabase(database);
    }

    // open database instance
    private openDatabase = (database:string)=> {
        this.db = new (this.cradle.Connection)().database(database);
        // check if database exists
        this.db.exists((err, exists) => {
            if (err) {
                throw new Error('Error: ' + this.database + ' does not exist!');
            }
            console.log('Database', this.database, 'exists');
        });

        this.user = new User(this.db, this.LISTS, this.VIEWS);
        this.trip = new Trip(this.db, this.LISTS);
        this.location = new Location(this.db, this.LISTS);
        this.staticdata = new StaticData(this.db, this.LISTS);
        this.attachment = new Attachment(this.db, this.LISTS);
        this.util = new Util(this.db);
        this.mail = new Mail(this.db, this.LISTS);
        this.chat = new Chat(this.db, this.LISTS);
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
        server.expose('getUserByUUID', this.user.getUserByUUID);
        server.expose('getUserLogin', this.user.getUserLogin);
        server.expose('createUser', this.user.createUser);
        server.expose('updateUser', this.user.updateUser);
        server.expose('updateUserPassword', this.user.updateUserPassword);
        server.expose('deleteUserById', this.user.deleteUserById);
        server.expose('updateUserMail', this.user.updateUserMail);

        // trip
        server.expose('getTrips', this.trip.getTrips);
        server.expose('getTripById', this.trip.getTripById);
        server.expose('getTripsByCity', this.trip.getTripsByCity);
        server.expose('searchTripsByQuery', this.trip.searchTripsByQuery);
        server.expose('updateTrip', this.trip.updateTrip);
        server.expose('createTrip', this.trip.createTrip);
        server.expose('deleteTripById', this.trip.deleteTripById);

        // location
        server.expose('getLocationsByUserId', this.location.getLocationsByUserId);
        server.expose('getLocationById', this.location.getLocationById);
        server.expose('deleteLocationsByUserId', this.location.deleteLocationsByUserId);
        server.expose('deleteLocationById', this.location.deleteLocationById);
        server.expose('createLocation', this.location.createLocation);
        server.expose('updateLocation', this.location.updateLocation);

        // static data mood
        server.expose('getMoods', this.staticdata.getMoods);
        server.expose('createMood', this.staticdata.createMood);
        server.expose('updateMood', this.staticdata.updateMood);
        server.expose('deleteMoodById', this.staticdata.deleteMoodById);

        // static data city
        server.expose('getCities', this.staticdata.getCities);
        server.expose('getCitiesWithTrips', this.staticdata.getCitiesWithTrips);
        server.expose('createCity', this.staticdata.createCity);
        server.expose('updateCity', this.staticdata.updateCity);
        server.expose('deleteCityById', this.staticdata.deleteCityById);

        // static data accommodations
        server.expose('getAccommodations', this.staticdata.getAccommodations);
        server.expose('createAccommodation', this.staticdata.createAccommodation);
        server.expose('updateAccommodation', this.staticdata.updateAccommodation);
        server.expose('deleteAccommodationById', this.staticdata.deleteAccommodationById);

        // static data accommodations equipment
        server.expose('getAccommodationsEquipment', this.staticdata.getAccommodationsEquipment);
        server.expose('createAccommodationEquipment', this.staticdata.createAccommodationEquipment);
        server.expose('updateAccommodationEquipment', this.staticdata.updateAccommodationEquipment);
        server.expose('deleteAccommodationEquipmentById', this.staticdata.deleteAccommodationEquipmentById);

        // attachment
        server.expose('getPicture', this.attachment.getPicture);
        server.expose('savePicture', this.attachment.savePicture);

        // utility methods
        server.expose('updateDocument', this.util.updateDocument);
        server.expose('createView', this.util.createView);
        server.expose('entryExist', this.util.entryExist);

        // mail
        server.expose('getRegistrationMail', this.mail.getRegistrationMail);

        // chat
        server.expose('getConversationsByUserId', this.chat.getConversationsByUserId);
        server.expose('createConversation', this.chat.createConversation);
        server.expose('getConversationById', this.chat.getConversationById);
        server.expose('getMessagesByConversionId', this.chat.getMessagesByConversionId);
        server.expose('saveMessage', this.chat.saveMessage);
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
