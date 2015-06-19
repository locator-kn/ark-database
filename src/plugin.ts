import User from './user/user';
import Trip from './trip/trip';
import Location from './location/location';
import StaticData from './staticdata/staticdata';
import Attachment from './attachment/attachment';
import Util from './util/util'
import Mail from './mail/mail'
import Chat from './chat/chat'
import {setup} from './setup';

export interface IRegister {
    (server:any, options:any, next:any): void;
    attributes?: any;
}

/**
 * database plugin
 *
 * example call:
 *
 *      // local database (default)
 *      new Database('app');
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
        LIST_USER_PUBLIC: 'user/listall/user_public',
        LIST_USER_LOGIN: 'user/listall/login',
        LIST_ADMIN_LOGIN: 'user/listall/loginAdmin',
        LIST_USER_UUID: 'user/listall/uuid',
        LIST_LOCATION_USER: 'location/listall/locationByUser',
        LIST_LOCATION_LOCATION: 'location/listall/location',
        LIST_LOCATION_PRELOCATION_USER: 'location/listall/preLocationByUser',
        LIST_SEARCH_TRIP: 'search/searchlist/city',
        LIST_DATA_MOOD: 'data/listall/moods',
        LIST_DATA_ACC_EQUIPMENT: 'data/listall/accommodations_equipment',
        LIST_DATA_CITY: 'data/listall/cities',
        LIST_DATA_CITY_TRIPS: 'data/listall/cities_trips',
        LIST_TRIP_ALL: 'trip/listall/trip',
        LIST_TRIP_CITY: 'trip/listall/city',
        LIST_TRIP_USER: 'trip/listall/tripByUserId',
        LIST_TRIP_MY: 'trip/listall/myTrips',
        LIST_MAIL_REGISTRATION: 'mail/listall/registration',
        LIST_MAIL_PASSWORD_FORGOTTEN: 'mail/listall/password_forgotten',
        LIST_CHAT_CONVERSATIONS: 'chat/listallByUserId/conversationsByUserId',
        LIST_CHAT_CONVERSATIONBYID: 'chat/listall/conversationsById',
        LIST_CHAT_MESSAGESBYCONVERSATIONID: 'chat/listall/messagesByConversationId',
        LIST_CHAT_CONVERSATIONS_BY_TWO_USER: 'chat/getExistingConversationByUsers/conversationsByUserId'
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

        this.user = new User(this.db, this.LISTS);
        this.trip = new Trip(this.db, this.LISTS);
        this.location = new Location(this.db, this.LISTS);
        this.staticdata = new StaticData(this.db, this.LISTS);
        this.attachment = new Attachment(this.db);
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
        server.expose('getAdminLogin', this.user.getAdminLogin);
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
        server.expose('getUserTrips', this.trip.getUserTrips);
        server.expose('getMyTrips', this.trip.getMyTrips);
        server.expose('updateTripsWithLocationImage', this.trip.updateTripsWithLocationImage);

        // location
        server.expose('getLocationsByUserId', this.location.getLocationsByUserId);
        server.expose('getLocationById', this.location.getLocationById);
        server.expose('deleteLocationsByUserId', this.location.deleteLocationsByUserId);
        server.expose('deleteLocationById', this.location.deleteLocationById);
        server.expose('createLocation', this.location.createLocation);
        server.expose('updateLocation', this.location.updateLocation);
        server.expose('getPreLocationsByUserId', this.location.getPreLocationsByUserId);

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
        server.expose('deleteDocument', this.util.deleteDocument);
        server.expose('updateDocumentWithoutCheck', this.util.updateDocumentWithoutCheck);

        // mail
        server.expose('getRegistrationMail', this.mail.getRegistrationMail);
        server.expose('getPasswordForgottenMail', this.mail.getPasswordForgottenMail);

        // chat
        server.expose('getConversationsByUserId', this.chat.getConversationsByUserId);
        server.expose('createConversation', this.chat.createConversation);
        server.expose('getConversationById', this.chat.getConversationById);
        server.expose('getMessagesByConversionId', this.chat.getMessagesByConversionId);
        server.expose('saveMessage', this.chat.saveMessage);
        server.expose('getExistingConversationByTwoUsers', this.chat.getExistingConversationByTwoUsers);
    }


    register:IRegister = (server, options, next) => {
        server.bind(this);
        this.exportApi(server);
        next();
    };

    errorInit(err) {
        if (err) {
            console.log('Error: init plugin failed:', err);
        }
    }

    /**
     * Method for setting up all needed documents in the database. Needs to be called at
     * least one time, before the application goes live.
     * @param callback
     */
    public setup(data, callback) {
        if (!data) {
            // intern database views
            setup(this.db, callback);
        } else if (data.key) {
            // view document
            this.db.save(data.key, data.value, callback);
        } else {
            // regular document
            this.db.save(data, callback);
        }
    }

}
