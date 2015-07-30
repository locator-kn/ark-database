declare var Promise:any;

import Util from './../util/util';

export default
class User {
    private boom:any;
    private util:any;
    private TYPE = 'user';

    constructor(private db:any, private LISTS:any) {
        this.boom = require('boom');
        this.util = new Util(db);
    }

    /**
     * Get user from database by specific user id.
     *
     * @param userId:string
     * @param callback
     */
    getUserById = (userId:string) => {
        return this.util.retrieveSingleValue(this.LISTS.LIST_USER_PUBLIC, userId);
    };

    /**
     * get user by UUID
     * @param uuid
     * @param callback
     */
    getUserByUUID = (uuid:string) => {
        return this.util.retrieveSingleValue(this.LISTS.LIST_USER_UUID, uuid);
    };


    /**
     * Get user from database by specific user id.
     *
     * @param callback
     */
    getUsers = () => {
        return this.util.retrieveAllValues(this.LISTS.LIST_USER_ALL);
    };

    /**
     * Update user information.
     *
     * @param userId:string
     * @param user:IUser
     * @param callback
     */
    updateUser = (userId:string, user:any) => {
        return this.util.updateDocument(userId, userId, user, this.TYPE);
    };

    /**
     * Create a new user.
     *
     * @param user:IUser
     * @param callback
     */
    createUser = (user) => {
        return this.util.createDocument(user);
    };


    /**
     * Get user by mail
     *
     * @param mail:string
     */
    getUserLogin = (mail:string) => {
        return this.getLogin(mail, this.LISTS.LIST_USER_LOGIN);
    };

    /**
     * Get user by mail
     *
     * @param mail:string
     */
    isMailAvailable = (mail:string) => {
        return new Promise((resolve, reject) => {
            this.db.list(this.LISTS.LIST_USER_LOGIN, {key: mail}, (err, result) => {
                if (err) {
                    return reject(this.boom.badRequest(err));
                } else if (result.length) {
                    return reject(this.boom.conflict('mail not available for registration'))
                }
                resolve();
            });
        });
    };

    /**
     * Get admin user by mail
     *
     * @param mail:string
     */
    getAdminLogin = (mail:string) => {
        return this.getLogin(mail, this.LISTS.LIST_ADMIN_LOGIN);
    };

    private getLogin = (mail:string, list:string) => {
        if (!mail) {
            return Promise.reject(this.boom.badRequest('missing mail'));
        }
        return new Promise((resolve, reject) => {
            this.db.list(list, {key: mail}, (err, result) => {
                if (err || !result[0]) {
                    return reject(err || 'No user found');
                }
                resolve(result[0]);
            });
        });
    };

    /**
     * Update only password attribute and leave the others untouched.
     *
     * @param userId:string
     * @param password:string
     * @param callback
     */
    updateUserPassword = (userId:string, password:string) => {
        // redirect to update method
        return this.updateUser(userId, {'password': password});
    };

    /**
     * Update the mail field of a user. The mail will be added to the existing mail
     *
     * @param userId
     * @param mail
     * @param callback
     */
    updateUserMail = (userId:string, mail:any) => {
        return Promise.reject(this.boom.wrap('not implemented yet', 501));
        /* // append new mail to field of user
         this.util.appendFieldValue(userId, 'mail', mail,this.TYPE);*/
    };

    /**
     * Delete a particular user by id.
     *
     * @param userId:string
     * @param callback
     */
    deleteUserById = (userId:string) => {
        return this.util.deleteDocument(userId, userId, this.TYPE);
    };

}
