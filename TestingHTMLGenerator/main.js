// To User run node main.js in terminal then go to localhost:4000
const url = require('url');
const http = require('http');
const hostname = '127.0.0.1';
const PORT = 4000; 
var path = require('path');

var express = require("express");
var app = express();

// Going to the Main Page
// Requests is just how it is in GET/Post Methods in URL 
app.get('/', function(request, response){
	console.log("Going to MainPage");
	response.sendFile(__dirname+'/test.html');
});
// Going to the About Page for Generation
app.get('/about', function(request,response){
	console.log("Going To about Page");
	response.sendFile(__dirname+'/about.html');
});
// Going to the Applause Template
app.get('/ApplauseRequests', function(request,response){
	console.log("Going to ApplauseRequests Page");
	response.sendFile(__dirname+'/ApplauseRequests.html');
})
// Going to the Final Applause generation
app.get('/FinalApplause', function(request, response){
	console.log("Going to Final Applause Page");
	response.sendFile(__dirname+'/FinalApplause.html')
})

// Post Handler https://www.hacksparrow.com/post-get-request-handling-in-node-js-express.html
app.post('')


// For port Listening To and letting you know what port it is running on
app.listen(PORT);
console.log(`Server running at http://${hostname}:${PORT}/`);