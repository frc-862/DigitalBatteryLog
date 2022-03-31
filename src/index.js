const runSync = require('./api/runSync.js');
const connect = require('./database/connect.js');
const app = require('../src/server/app.js')
require('dotenv').config();

//connects computer to mongoDB database
try {
    connect()
} catch(err) { if (err) console.log(err); };

//runs cron-schedule to periodically scan for changes in the database and then updates google sheets if there are. 
try {
    runSync();
} catch(err) { if (err) console.log(err); };

try {
    app();
} catch(err) { err ? console.error(err) : null };