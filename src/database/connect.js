const mongoose = require('mongoose');
const getLogs = require('./functions/getLogs');

//connects computer to mongoDB database (local)
async function connect() {
await mongoose.connect(process.env.databaseAddress).then(() => console.log('connected')).catch((err) => console.log(err));
console.log(await getLogs())
}
module.exports = connect; 