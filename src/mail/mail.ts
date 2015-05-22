export default
class Mail {
    boom:any;
    constructor(private db:any, private LISTS:any) {
        this.boom = require('boom')
    }

    /**
     * get text and subject etc. from database for registration mail
     * @param callback
     */
    getRegistrationMail = (callback) => {
        this.db.list(this.LISTS.LIST_MAIL_REGISTRATION, (err, result) => {
            this.checkForSingleValue(err, result, callback);
        });
    };

    /**
     * get text and subject etc. from database for password forgotten mail
     * @param callback
     */
    getPasswordForgottenMail = (callback) => {
        this.db.list(this.LISTS.LIST_MAIL_PASSWORD_FORGOTTEN, (err, result) => {
           this.checkForSingleValue(err, result, callback);
        });
    };

    /**
     * Check if result a singlee value.
     *
     * @param err
     * @param result
     * @param callback
     * @returns {any}
     */
    checkForSingleValue = (err, result, callback) => {
        if (err) {
            return callback(err);
        }
        if (!result.length) {
            return callback(this.boom.create(404, 'Database entry not found'))
        }
        // return first entry from array
        return callback(null, result[0]);
    };
}

