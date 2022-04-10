// returns all batteries signed in within the last 2 hours 
const batteryDataModel = require('../../schemas/batterySchema.js')
async function getLogs() {

const currentTime = Date.now()
//gets all singed In documents
const res = await batteryDataModel.find();
let finalDocs = [];
//for every battery signed in, add it to the final values list ONLY if its only been signed back in for under 2 hours
for (let doc in res) {
    if (currentTime - Date.parse(res[doc].timeIn) <= 18000000 || currentTime - Date.parse(res[doc].timeOut) <= 18000000 ) {
        finalDocs.push(res[doc])
    }
}
//returns an array of all docs that meet this requirement. 
return finalDocs; 
}
module.exports = getLogs;   