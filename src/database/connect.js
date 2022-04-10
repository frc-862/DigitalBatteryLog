const mongoose = require('mongoose');

//connects computer to mongoDB database (local)
async function connect() {
await mongoose.connect(process.env.databaseAddress).then(() => console.log('connected')).catch((err) => console.log(err));
}
module.exports = connect; 