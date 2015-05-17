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
            if (err) {
                return callback(err);
            }
            if (!result.length) {
                return callback(this.boom.create(404, 'user not found'))
            }
            // return first entry from array
            return callback(null, result[0]);
        });
    }
}