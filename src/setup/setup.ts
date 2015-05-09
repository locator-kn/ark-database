export default
class Setup {
    constructor(private db) {
    }

    createView = (name:string, views, callback) => {
        this.db.save(name, views);
        callback(null, 'View created!');
    }
}