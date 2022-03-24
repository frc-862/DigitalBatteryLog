const mongoose = require('mongoose');
const { databaseAddress } = require('../../config/constants/mongoDBConstants.json');

//connects computer to mongoDB database (local)
async function connect() {
await mongoose.connect(databaseAddress).then(() => console.log('connected')).catch((err) => console.log(err));
}
module.exports = connect; 