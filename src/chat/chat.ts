import Util from './../util/util';

export default
class Chat {
    private util:any;

    constructor(private db:any, private LISTS:any) {
        this.util = new Util(db);
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
        this.util.createDocument(conversation, callback);
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
        this.db.list(this.LISTS.LIST_CHAT_MESSAGESBYCONVERSATIONID, {key: conversationId}, (err, data) => {
            if(err) {
                return callback(err);
            }
            data.sort((a, b) => {
                return a.timestamp - b.timestamp;
            });
            callback(null, data);
        });
    };

    /**
     * Save new message
     *
     * @param messageObj
     * @param callback
     */
    saveMessage = (messageObj, callback) => {
        this.util.createDocument(messageObj, callback);
    };
}