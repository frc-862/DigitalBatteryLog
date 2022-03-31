const http = require('http')
const fs = require('fs')
async function app() {
  const server = http.createServer((req, res) => {

    console.log("AAAA " + req.method + " " + req.headers["lrAction"])
    if(req.method == "GET"){

      // GETTING PAGE OR GETTING DATA

      if(req.headers["lrAction"] == undefined){
        // get page
        fs.readFile("michael.html", function(err, data) {
          res.setHeader("Content-Type", "text/html");
          res.writeHead(200);
          res.end(data);

        });
        
      }else{
        // get from API
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end({data : "In Progress"});
        
      }
      
    }else{
      // POSTING DATA
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end({message : "Not Implemented"});
    }
    

    
  })



  server.listen(3000)
}
module.exports = app;