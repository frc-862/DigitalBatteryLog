getNewToken = require('../api/getToken.js');

try {
    getNewToken();
} catch(err) { console.log(err) };