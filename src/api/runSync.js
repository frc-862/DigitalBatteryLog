const checkDb = require('./syncData.js');
const cron = require('node-cron');
const spawn = require("child_process").spawn;

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
                try {
                    checkDb();
                } catch(err){
                    if (err) console.log(err);
                }
            } else {
                return;
            }
        }).catch((err) => console.log(err));
        
    })
}
//function that attempts to perform a DNS lookup on google.com. Determines if there is an internet connection. 
async function checkInternet(cb) {
    const process = spawn('py', ["./src/api/checkInternet.py"]);

    process.stderr.on('data', (data) => {
        cb(false);
        process.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    })
    process.stdout.on('data', (data) => {
        const str = String.fromCharCode.apply(null, data).replace(/\s/g, '');
        if (str == 'False') {
            return cb(false);
        } else if (str == 'True') {
            return cb(true)
        } else {
            console.log('There was an error when checking for an internet connection');
        }
        process.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    })
    
}

module.exports = runSync;