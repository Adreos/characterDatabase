const path = require("path"), fs = require('fs');
var outputFile = './files/characters.txt';

var router = function router(app) {
//Default GET
	//
	app.get('/read-records', function(req,res) {
		fs.readFile(outputFile,"utf8",function(err,data){
			if(err) {
				res.send(err);
			} else {
				data = "[" +  data + "]";
				res.send(data);
			}
		});
	});
	app.get('/read-characters', function(req,res) {
		fs.readFile(outputFile,"utf8",function(err,data){
			if(err) {
				res.send(err);
			} else {
//				data = "{msg:\"SUCCESS\",data:[" +  data + "]}";
				data = {msg:"SUCCESS",data:JSON.parse("[" + data + "]")};
				res.send(data);
			}
		});
	});
	app.get('/',function(req,res){
		res.status(200).sendFile(path.join(__dirname + '/../client/index.html'));
	});
	
	//Wildcard GET
	app.get('/*',function(req,res){
		res.status(200).sendFile(path.join(__dirname + '/../client' + req._parsedOriginalUrl.pathname));
	
	});
}
module.exports = router;
