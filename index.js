const https = require('https');
const fs = require('fs');

//const for https server
const options = {
        key: fs.readFileSync('privkey.pem'),
        cert: fs.readFileSync('fullchain.pem')
};

var datetime = new Date();
datetime.setDate(datetime.getDate() - 1);	//set initial date to yesterday, so met.no responds with meteo data
var datetimestr = datetime.toUTCString();
var ifmodified = datetimestr; //defautl value; normally holds datatime of last scuccesful weather retrieval

var curWeather = ""; //global var; every x minutes weather is read from met.no; and sent to client when corresponding URI is requested
var useragent = "'Garmin watchface bas.aan.de.wiel@gmail.com";
var hostname = "api.met.no";
var port     = 443;
var method   = "GET";
var lat	 = 52.22; //defaults to Almere, NL; overwritten in weather request; then used in next call to readDcurrentWeather
var lon = 5.13; //defaults to ALmere, NL

function readCurrentWeather() {
  //READ wwather from met.no
  
  //construct header with modified since
  var headerObj = {"User-Agent":useragent, "If-Modified-Since":ifmodified};
  var path     = "/weatherapi/locationforecast/2.0/compact?lat=" + lat + "&lon=" + lon;
  //console.log("path= " + path);
  //var path     = "/weatherapi/locationforecast/2.0/compact?lat=52.22&lon=5.13";
  var optionsGET3 = {"hostname":hostname, "port":port, "path":path, "headers":headerObj, "method":method};

  const req = https.request(optionsGET3, response => {
    var receivedData = "";
    //console.log(`statusCode: ${response.statusCode}`)

   if (response.statusCode <200 || response.statusCode> 299) {
     response.on("data", function() {} ); //does nothing, but response.on should be necessary
   }
   else {
     datetime = new Date(); //succesful, so adapt ifmodified since string to current time
     datetimestr = datetime.toUTCString();
     ifmodified = datetimestr;  //in next API call, ifmodifiedsince last succesful retrieval is used

    // function(response) is called when the connection is established

    response.on('data', d => {
      receivedData += d; //add received data chunk to data already received
    });

    response.on('close', function() {
      //all data received received
      data = JSON.parse(receivedData);
      curWeather = data.properties.timeseries[0].data.instant.details; //get current weather out of JSON
    })
   }
   //POST: data contains either current weather, or is empty (when code 304 "data not changed" is received
    //baswi: bind error event
    req.on('error', error => {
      console.error(error)
    })
  });
  req.end() //baswi: this is necessary, otherwise no data is received
}

//#######################################
readCurrentWeather(); //initial call; subsequent calls occur after timer expiry

setInterval(() => { //is called every x msecs
  readCurrentWeather();
}, 900000);  //15 minutes


//#############################################################
//create HTTPS server
//
var cluster = require('cluster');
if (cluster.isMaster) {
	  cluster.fork();

	cluster.on('exit', function(worker, code, signal) {
	    console.log(`worker ${worker.process.pid} died`);
	    cluster.fork();
        });

}

if (cluster.isWorker) {
  const express = require("express");
  //To solve the cors issue
  const cors=require('cors');
	
  process.on('uncaughtException', err => {
           console.error('There was an uncaught error', err)
           process.exit(1) //mandatory (as per the Node.js docs)
  })
	
  // Create a service (the app object is just a callback).
  var app = express();
  https.createServer(options, app).listen(9090)
	
  app.use(express.static('public'));
  app.use(cors());

  app.get("/weather/current", function(req, res){
        lat = req.query.lat;
        //      console.log("lat: " + lat);
        lon = req.query.lon;
        //      console.log("lon= " + lon);
        //      readCurrentWeather(); //ONLY FOR TESTIN
        //      console.log("curWeather= " + curWeather);
        res.send(curWeather);
  });
 }





