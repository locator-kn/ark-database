declare
var Promise:any;

export default
class User {
    private boom:any;

    constructor(private db:any, private LISTS:any, private VIEWS:any) {
        this.boom = require('boom');
    }

    /**
     * Get user from database by specific user id.
     *
     * @param userId:string
     * @param callback
     */
    getUserById = (userId:string, callback) => {
        this.getObjectOf(userId, this.LISTS.LIST_USER_ALL, callback);
    };

    /**
     * get user by UUID
     * @param uuid
     * @param callback
     */
    getUserByUUID = (uuid:string, callback) => {
        this.getObjectOf(uuid, this.LISTS.LIST_USER_UUID, callback);
    };

    /**
     * function to get only a object instead of an array.
     *
     * @param keyValue
     * @param listName
     * @param callback
     *
     * TODO: extract function to use it in other functions
     */
    getObjectOf = (keyValue, listName, callback) => {
        this.db.list(listName, {key: keyValue}, (err, result) => {
            if (err) {
                return callback(err);
            }
            if (!result.length) {
                return callback(this.boom.create(404, 'Database entry not found'))
            }
            // return first entry from array
            return callback(null, result[0]);
        });
    };


    /**
     * Get user from database by specific user id.
     *
     * @param callback
     */
    getUsers = (callback) => {
        this.db.list(this.LISTS.LIST_USER_ALL, callback);
    };

    /**
     * Update user information.
     *
     * @param userId:string
     * @param rev:string
     * @param user:IUser
     * @param callback
     */
    updateUser = (userId:string, rev:string, user, callback) => {
        this.db.save(userId, rev, user, callback);
    };

    /**
     * Create a new user.
     *
     * @param user:IUser
     * @param callback
     */
    createUser = (user, callback) => {
        this.db.save(user, callback);
    };


    /**
     * Get json object with login data of specific user id.
     *
     * @param userId:string
     * @param callback
     */
    getUserLogin = (userId:string) => {
        var promise = new Promise((resolve, reject) => {
            this.db.list(this.LISTS.LIST_USER_LOGIN, {key: userId}, (err, result) => {
                // reject also if there is no match in the database
                if (err || !result[0]) {
                    return reject(err);
                }
                resolve(result[0]);
            });
        });

        return promise;
    };

    /**
     * Update only password attribute and leave the others untouched.
     *
     * @param userId:string
     * @param password:string
     * @param callback
     */
    updateUserPassword = (userId:string, password:string, callback) => {
        this.db.merge(userId, {'password': password}, callback);
    };

    /**
     * Delete a particular tuser by id.
     *
     * @param userId:string
     * @param callback
     */
    deleteUserById = (userId:string, callback) => {
        this.db.remove(userId, callback);
    };

}
