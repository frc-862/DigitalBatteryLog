const checkDb = require('./syncData.js');
const cron = require('node-cron');
const dns = require('dns');
const { syncIntervalMinutes } = require('../../config/constants/constants.json')

async function runSync() {
    if (!(Number.isInteger(parseInt(syncIntervalMinutes)))) return console.error('ERROR! syncIntervalMinutes is not an integer');

    cron.schedule(`*/${syncIntervalMinutes} * * * *`, () => {
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