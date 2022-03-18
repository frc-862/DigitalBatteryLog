const mongoose = require('mongoose');
const checkDb = require('./syncData.js');
const cron = require('node-cron');

const { databaseAddress } = require('./auth/temp-externalDBAddress.json')
try {
    mongoose.connect(databaseAddress).then(() => console.log('connected'));
    cron.schedule('* * * * *', () => {
        console.log('scanning for updates');
        checkDb(); 
    })
    //checkDb();
} catch(err) {
    if (err) console.error(err)
}
