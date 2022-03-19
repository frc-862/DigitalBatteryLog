const batteryDataModel = require("../../schemas/batterySchema.js");

async function isSignedOut(bNum) {
    const res = await batteryDataModel.findOne({ batteryNumber: bNum, signedOut: true })
    if (res == null) {
        return false;
    } else {
        return true; 
    }
}

module.exports = isSignedOut;