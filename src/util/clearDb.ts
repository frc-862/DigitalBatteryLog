import mongoose from 'mongoose';
import readline from 'readline';
import batteryDataModel from "../schemas/batterySchema.js";
require('dotenv').config()

try {
    mongoose.connect(process.env.databaseAddress).then(() => { console.log('connected') });
} catch (err) {
    if (err) console.error(err);
}

async function clearDb() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    console.log('Are you sure you want to delete all database entries')
    rl.question('type Y for yes, anything else for No', (res) => {
        if (res != 'Y') return;
        batteryDataModel.deleteMany({}, (err) => {
            if (err) console.error(err);
            console.log('done')
            return;
        })
    })
}
clearDb();