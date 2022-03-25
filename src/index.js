const runSync = require('./api/runSync.js');
const connect = require('./database/connect.js');
require('dotenv').config();

//connects computer to mongoDB database
try {
    connect()
} catch(err) { if (err) console.log(err); };

//runs cron-schedule to periodically scan for changes in the database and then updates google sheets if there are. 
try {
    runSync();
} catch(err) { if (err) console.log(err); };
