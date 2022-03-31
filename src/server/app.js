const http = require('http')
const fs = require('fs')
// get functions to communicate to server
const isSignedOut = require("../database/functions/isSignedOut.js");
const submitData = require("../database/functions/submitDataByBatteryNumber.js");
// run function app when ready
async function app() {
  const server = http.createServer((req, res) => {

    // check if request is a GET request to get data or HTML
    if(req.method == "GET"){

      // If the request is not going to the API, return the HTML file
      if(req.url.includes("/api")){
        // data needs to be gotten from api

        // all API data is JSON
        res.writeHead(200, { 'content-type': 'application/json' });

        // first condition checking if API is looking for battery being signed out
        if(req.url.includes("isBatteryOut")){
          
          // get the battery raw # and then turn it into a proper
          var batRaw = req.url.split("/")[req.url.split("/").length - 1];
          if(batRaw.length != 4){
            res.end(JSON.stringify({valid : false}));
          }
          var batNum = batRaw.substring(0,2) + "." + batRaw.substring(2,4);
          batNum = parseFloat(batNum);
          // run the implemented function and handle the result back to the page
          isSignedOut(batNum).then(function(data){
            if(data){
              res.end(JSON.stringify({valid : true, signedOut : data}));
            }else{
              res.end(JSON.stringify({valid : false, signedOut : false}));
            }
          });
        }
        
        
      }else{
        if(req.url == "/"){
          req.url = "/michael.html";
        }
        console.log(req.url);
        // get page
        fs.readFile("src" + req.url, function(err, data) {
          // must specify diff. content type
          res.setHeader("Content-Type", "text/html");
          res.writeHead(200);
          res.end(data);

        });
        
      }
      
    }else{
      // Otherwise, request must be a POST
      // all post data is JSON
      res.writeHead(200, { 'content-type': 'application/json' });
      
      // checking if the request is to submit data
      if(req.url.includes("/submitsign")){
        // needs to get chunks of data before ending the request
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
          // on end, parse the data
          const data = JSON.parse(Buffer.concat(chunks));
          //console.log(data);
          // use implemented function to send the data
          submitData(data["bNum"], data["rintBefore"], data["socBefore"], data["rintAfter"], data["socAfter"], data["purpose"], data["group"]).then(() => {
            // once async function done, return a success
            res.end(JSON.stringify({success : true}));
          });
          
        })
      }else{
        res.end(JSON.stringify({message : "Not Implemented"}));
      }
      
    }
    

    
  })


  // available at localhost:3000

  server.listen(3000)
}
module.exports = app;