const batteryDataModel = require("../../schemas/batterySchema.js");

//returns an array of all batteries currently signed out
async function listSignedOut() {
return await batteryDataModel.find({ signedOut: true })
}
module.exports = listSignedOut;