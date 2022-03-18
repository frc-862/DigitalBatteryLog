// run this file with node manualCreate.js 
//follow the prompts to sign batteries in and out

const mongoose = require('mongoose');
const readline = require('readline');
const { databaseAddress } = require('../auth/temp-externalDBAddress.json');
const batteryDataModel = require("../schemas/batterySchema");

try {
    mongoose.connect(databaseAddress).then(() => { console.log('connected'); createDocument(); });
} catch (err) {
    if (err) console.error(err);
}
async function createDocument() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Which Battery?', (bNum) => {

        batteryDataModel.findOne({ batteryNumber: bNum, signedOut: true }, (err, data) => {
            if (err) return console.log(err);
            if (data == null) {
                console.log('---------------------')
                console.log('Signing out a battery');
                console.log('---------------------')
                rl.question('What is the rint of the battery ', (rNum) => {
                    rl.question('What is the state of charge of the battery?', (socNum) => {
                        rl.question('What is the purpose of this battery', (purpose) => {
                            rl.question(`You said: \nBatteryNumber: ${bNum}\nRint: ${rNum}\nSOC: ${socNum}\nPurpose: ${purpose}\nIs this correct? \nType Y to accept or any other key to deny`, (response) => {
                                if (response.toLowerCase() != 'y') {
                                    console.log('canceled');
                                    rl.close(); 
                                    mongoose.disconnect();
                                    return;
                                }
                                let doc = new batteryDataModel(
                                    {
                                        batteryNumber: bNum,
                                        timeOut: new Date().toString(),
                                        beakBefore: {
                                            rint: rNum,
                                            soc: socNum,
                                        },
                                        purpose: purpose,
                                        updated: false,
                                        signedOut: true,

                                    });
                                doc.save();
                                rl.question('would you like to add another battery log?\ntype Y to accept or any other key to deny', (res) => {
                                    if (res.toLowerCase() != 'y') {
                                        console.log('ok');
                                        rl.close()
                                        mongoose.disconnect();
                                        return;
                                    } else {
                                        console.log('splendid!');
                                        rl.close();
                                        createDocument(); 
                                    }
                                })
                            })
                        })
                    })
                })

            } else {
                console.log('---------------------')
                console.log('Signing in a battery');
                console.log('---------------------')
                rl.question('What is the rint of the battery ', (rNum) => {
                    rl.question('What is the state of charge of the battery?', (socNum) => {
                        rl.question(`You said: \nBatteryNumber: ${bNum}\nRint: ${rNum}\nSOC: ${socNum}\nIs this correct? \nType Y to accept or any other key to deny`, (response) => {
                            if (response.toLowerCase() != 'y') {
                                console.log('canceled');
                                rl.close(); 
                                mongoose.disconnect();
                                return;
                            }
                            data.timeIn = new Date().toString();
                            data.beakAfter.rint = rNum;
                            data.beakAfter.soc = socNum;
                            data.updated = false; 
                            data.save();
                            rl.question('would you like to add another battery log?\ntype Y to accept or any other key to deny', (res) => {
                                if (res.toLowerCase() != 'y') {
                                    console.log('ok');
                                    rl.close()
                                    mongoose.disconnect();
                                    return;
                                } else {
                                    console.log('splendid!');
                                    rl.close();
                                    createDocument(); 
                                }
                            })
                        })
                    })
                })
            }
        })
    })
}