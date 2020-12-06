const express = require('express'), fs = require('fs'), bodyParser = require('body-parser'), path = require('path');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + '/../client/browsecharacter.html')));
var outputFile = './files/characters.txt';

//OLD MANUAL TRANSFERS. REPLACED WITH WILDCARD BELOW
/*app.get('/browsecharacter',function(req,res){
	res.status(200).sendFile(path.join(__dirname + '/../client/browse-character.html'));

});
app.get('/writecharacter',function(req,res){
	res.status(200).sendFile(path.join(__dirname + '/../client/writecharacter.html'));

});
app.get('/js/jquery.js',function(req,res){
	res.status(200).sendFile(path.join(__dirname + '/../client/js/jquery.js'));
});
app.get('/js/character.js',function(req,res){
	res.status(200).sendFile(path.join(__dirname + '/../client/js/character.js'));

});
app.get('/css/default.css',function(req,res){
	res.status(200).sendFile(path.join(__dirname + '/../client/css/default.css'));

});*/

//Maker the server
var server;
var port = process.env.PORT || process.env.NODE_PORT || 5000;

//Service Listeners
var router = require("./router.js");
router(app);
var services = require("./services.js");
services(app);

//ROUTER

var router = require("./router.js");
router(app);


//App Listener
server = app.listen(port, function(err){
	if(err)
	{
		throw err;
	}
	console.log("Listening on port " + port);
});
