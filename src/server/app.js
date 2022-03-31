const http = require('http')
const fs = require('fs')
async function app() {
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'content-type': 'text/html' })
        fs.createReadStream('../../michael.html').pipe(res)
    })

    server.listen(3000)
}
module.exports = app;