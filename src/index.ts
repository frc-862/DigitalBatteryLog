import SheetsApi from './api/api.js';
import app from './server/app.js';
import Db from './database/db.js';
import env from 'dotenv'
env.config();

//connects computer to mongoDB database
    const db = new Db(process.env.databaseAddress);
    export { db };
//runs cron-schedule to periodically scan for changes in the database and then updates google sheets if there are. 
try {
    new SheetsApi();
} catch(err) { if (err) console.log(err); };

try {
    app();
} catch(err) { err ? console.error(err) : null };