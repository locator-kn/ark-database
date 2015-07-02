import {setUpDesignDocuments, createDefaultLocationAndUser} from './util/setup'

export function setup(database:any, callback:any) {

    setUpDesignDocuments(database, callback);

    createDefaultLocationAndUser(database, callback);
}
