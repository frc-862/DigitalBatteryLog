// returns all batteries signed in within the last 2 hours 
const batteryDataModel = require('../../schemas/batterySchema.js')
async function getSignedInLogs() {

const currentTime = new Date.now()
const res = await batteryDataModel.find({ signedOut: false });
let finalDocs = [];

for (let doc in res) {
    if (currentTime - Date.parse(res[doc].timeIn) >= 7200000 ) {
        finalDocs.push(res[doc])
    }
}
return finalDocs; 
}
module.exports = getSignedInLogs;