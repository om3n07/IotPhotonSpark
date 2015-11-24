var five = require ("johnny-five");
var Weather = require ("j5-sparkfun-weather-shield")(five);
var Particle = require ("particle-io");
var http = require("http");
var fs = require("fs");

// Credentials for Particle and API (once implemented)
var token = "";
var deviceId = "";
var location = "";
var host = "";
var endpoint = "";

var board = new five.Board({
	io: new Particle({
		token: token,
		deviceId: deviceId
	})
});

board.on("ready", function() {
	console.log("Board connected...");
	
	var weather = new Weather({
		variant: "PHOTON",
		freq: 5000, //2 minutes
		elevation: 682
	})
	
	weather.on("data", function() {
		var payload = JSON.stringify ({
			deviceId: deviceId,
			location: location,
			celsius: this.celsius,
			fahrenheit: this.fahrenheit,
			relativeHumidity: this.relativeHumidity,
			pressure: this.pressure,
			feet: this.feet,
			meters: this.meters
		});
		
		console.log("Sending mesage: " + payload);
		PostData(payload);
	});
	
	function PostData(payload) {
  // An object of options to indicate where to post to
  var post_options = {
      host: host,
      port: '80',
      path: endpoint,
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
		//   'Content-Encoding': 'gzip'
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
  });

  // post the data
  post_req.write(payload);
  post_req.end();

}})