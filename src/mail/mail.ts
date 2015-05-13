export default
class Mail {
    constructor(private db:any, private LISTS:any) {
    }

    getRegistrationMail = (callback) => {
        this.db.list(this.LISTS.LIST_MAIL_REGISTRATION,  callback);
    }
}