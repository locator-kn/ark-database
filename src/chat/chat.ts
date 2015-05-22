export default
class Chat {
    constructor(private db:any, private LISTS:any) {
    }

    /**
     * Returns a list of conversations by userid.
     * @param userid
     * @param callback
     */
    getConversationsByUserId = (userid:string, callback) => {
        this.db.list(this.LISTS.LIST_CHAT_CONVERSATIONS, {key: userid}, callback);
    };
}