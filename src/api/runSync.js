const checkDb = require('./syncData.js');
const cron = require('node-cron');
const dns = require('dns');

//function run by index.js for syncing database with google sheets
async function runSync() {
    //checking syncIntervalMinutes in constants.json and insures its an integer
    if (!(Number.isInteger(parseInt(process.env.syncInterval)))) return console.error('ERROR! syncInterval is not an integer');

    //node-cron schedule for running sync at interval of your choice
    cron.schedule(`*/${process.env.syncInterval} * * * *`, () => {
        //check if there is an internet connection. 
        checkInternet(function(isConnected) {
            if (isConnected) {
                console.log('Internet connection good; scanning for updates');
                checkDb();
            } else {
                return;
            }
        }).catch((err) => console.log(err));
        
    })
}
//function that attempts to perform a DNS lookup on google.com. Determines if there is an internet connection. 
async function checkInternet(cb) {
    await dns.lookup('google.com',function(err) {
        if (err && err.code == "ENOTFOUND") {
            cb(false);
        } else {
            cb(true);
        }
    })
}

module.exports = runSync;