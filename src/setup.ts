import {setUpDesignDocuments, createDefaultLocationAndUser} from './util/setup'

export function setup(database:any, password:string, callback:any) {

    setUpDesignDocuments(database, callback);

    createDefaultLocationAndUser(database, password, callback);
}
