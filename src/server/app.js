const http = require('http')
const fs = require('fs')
const isSignedOut = require("../database/functions/isSignedOut.js");
async function app() {
  const server = http.createServer((req, res) => {

    console.log("AAAA " + req.method + " " + req.headers["lrAction"])
    if(req.method == "GET"){

      // GETTING PAGE OR GETTING DATA
      console.log(req.url);
      if(!req.url.includes("/api")){
        // get page
        fs.readFile("michael.html", function(err, data) {
          res.setHeader("Content-Type", "text/html");
          res.writeHead(200);
          res.end(data);

        });
        
      }else{
        // get from API
        console.log("GETTING DATA FROM API")


        res.writeHead(200, { 'content-type': 'application/json' });

        if(req.url.includes("isBatteryOut")){
          
          var batRaw = req.url.split("/")[req.url.split("/").length - 1];
          if(batRaw.length != 4){
            res.end(JSON.stringify({valid : false}));
          }
          var batNum = batRaw.substring(0,2) + "." + batRaw.substring(2,4);
          batNum = parseFloat(batNum);

          isSignedOut(batNum).then(function(data){
            console.log(data);
            if(data){
              res.end(JSON.stringify({valid : true, signedOut : data}));
            }else{
              res.end(JSON.stringify({valid : false, signedOut : false}));
            }
          });
        }
        //res.end(JSON.stringify({message : "Not Implemented"}));
        
      }
      
    }else{
      // POSTING DATA
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({message : "Not Implemented"}));
    }
    

    
  })



  server.listen(3000)
}
module.exports = app;