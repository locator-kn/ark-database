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
        this.db.list(this.LISTS.LIST_CHAT_CONVERSATIONS, {userId: userid}, callback);
    };

    /**
     * Create a new user.
     *
     * @param conversation:any
     * @param callback
     */
    createConversation = (conversation, callback) => {
        this.db.save(conversation, callback);
    };

    /**
     * Get conversation by conversationId
     *
     * @param conversationId:string
     * @param callback
     */
    getConversationById = (conversationId:string, callback) => {
        this.db.list(this.LISTS.LIST_CHAT_CONVERSATIONBYID, {key: conversationId}, (err, data) => {
            if(!err && data.length) {
                return callback(err, data[0]);
            }
            callback(err, data);
        });
    }
}