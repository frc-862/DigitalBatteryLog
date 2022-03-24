const batteryDataModel = require("../../schemas/batterySchema.js");

async function isSignedOut(bNum) {
    //accepts a battery number and determines if it is signed out or now, returns true or false.
    const res = await batteryDataModel.findOne({ batteryNumber: bNum, signedOut: true })
    if (res == null) {
        return false;
    } else {
        return true; 
    }
}

module.exports = isSignedOut;