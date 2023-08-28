import {rm} from 'fs/promises';
import {join} from 'path';

global.beforeEach(async () => {
    try{
        await rm(join( __dirname, '..', 'test.sqlite'));
    }
    catch(error) {
        console.log("Error in deleting 'test.sqlite' file");
    }
});