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
     * Returns an array of a conversation of both users.
     * Empty array if no conversation exists
     * @param userid
     * @param userid2
     * @param callback
     */
    getExistingConversationByTwoUsers = (userid:string, userid2:string, callback) => {
        this.db.list(this.LISTS.LIST_CHAT_CONVERSATIONS_BY_TWO_USER, {userId: userid, userId2: userid2}, callback);
    };

    /**
     * Create a new user.
     *
     * @param conversation:any
     * @param callback
     */
    createConversation = (conversation, callback) => {
        var date = new Date();
        conversation.create_date= date.toISOString();
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
            if (!err && data.length) {
                return callback(err, data[0]);
            }
            callback(err, data);
        });
    };

    /**
     * Get messages by conversationId
     *
     * @param conversationId:string
     * @param callback
     */
    getMessagesByConversionId = (conversationId:string, callback) => {
        this.db.list(this.LISTS.LIST_CHAT_MESSAGESBYCONVERSATIONID, {key: conversationId}, callback);
    };

    /**
     * Save new message
     *
     * @param messageObj
     * @param callback
     */
    saveMessage = (messageObj, callback) => {
        var date = new Date();
        messageObj.create_date = date.toISOString();
        this.db.save(messageObj, callback);
    };
}