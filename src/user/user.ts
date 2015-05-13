
declare var Promise: any;

export default
class User {
    constructor(private db:any, private LISTS:any, private VIEWS:any) {
    }

    /**
     * Get user from database by specific user id.
     *
     * @param userId:string
     * @param callback
     */
    getUserById = (userId:string, callback) => {
        this.db.list(this.LISTS.LIST_USER_ALL, {key: userId}, callback);
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
                if(err || !result[0]) {
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