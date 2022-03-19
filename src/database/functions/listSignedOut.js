const batteryDataModel = require("../../schemas/batterySchema.js");

async function listSignedOut() {
return await batteryDataModel.find({ signedOut: true })
}
module.exports = listSignedOut;