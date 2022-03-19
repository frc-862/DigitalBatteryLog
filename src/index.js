const runSync = require('./api/runSync.js');
const connect = require('./database/connect.js');
try {
    connect()
} catch(err) { if (err) console.error(err); };

try {
    runSync();
} catch(err) { if (err) console.log(err); };
