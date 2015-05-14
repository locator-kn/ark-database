export default
class Mail {
    constructor(private db:any, private LISTS:any) {
    }

    /**
     * get text and subject etc. from database for registration mail
     * @param callback
     */
    getRegistrationMail = (callback) => {
        this.db.list(this.LISTS.LIST_MAIL_REGISTRATION,  callback);
    }
}