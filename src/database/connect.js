const mongoose = require('mongoose');
const { databaseAddress } = require('../../config/constants/mongoDBConstants.json');

async function connect() {
mongoose.connect(databaseAddress).then(() => console.log('connected')).catch((err) => console.log(err));
}
module.exports = connect; 