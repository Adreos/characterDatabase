const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const dbURL = (process.env.DB_URI || "mongodb://localhost") + ":27017";
const path = require("path"), fs = require('fs');
var outputFile = './files/characters.txt';

function addtext(text,newtext)
{
	if(text != '')
		text += ',' + newtext;
	else
		text = newtext;
	return text;
}

var router = function router(app) {
//Default GET
	//
	app.get('/read-records', function(req,res) {
/*		fs.readFile(outputFile,"utf8",function(err,data){
			if(err) {
				res.send(err);
			} else {
				data = "[" +  data + "]";
				res.send(data);
			}
		});*/
		var query = "", raceCheck = /.*.*/, classCheck = /.*.*/, genderCheck = /.*.*/, IDCheck = /.*.*/;
		if(typeof(req.query.race) != 'undefined' && req.query.race != '')
			raceCheck = req.query.race;
		if(typeof(req.query.gender ) != 'undefined' && req.query.gender != '')
			genderCheck = req.query.gender;
		if(typeof(req.query.class) != 'undefined' && req.query.class != '')
			classCheck = req.query.class;
		if(typeof(req.query.ID) != 'undefined' && req.query.ID != '')
			IDCheck = req.query.ID;
//		if(typeof(res.query.gender) != 'undefined' && res.query.gender != '')
//			genderCheck = res.query.gender;
		query = {"characterRace" : raceCheck , "characterClass" : classCheck, "characterGender" : genderCheck, "ID" : IDCheck};
//		console.log(query);
		MongoClient.connect(dbURL,{useUnifiedTopology:true},function(err,client){
			if(err) {
				return res.status(200).send(JSON.stringify({msg:"Conneciton Error: " + err}));
			} else {
				var dbo = client.db("ragel");

				dbo.collection("characters").find(query).toArray(function(err,data){
					client.close();
					if(err) {
						return res.status(200).send(JSON.stringify({msg:"Transmit Error: " + err}));
					} else {
						return res.status(200).send({msg:"SUCCESS",data:data});
					}
				});
			}
		});
	});
	app.get('/read-characters', function(req,res) {
		/*fs.readFile(outputFile,"utf8",function(err,data){
			if(err) {
				res.send(err);
			} else {
//				data = "{msg:\"SUCCESS\",data:[" +  data + "]}";
				data = {msg:"SUCCESS",data:JSON.parse("[" + data + "]")};
				res.send(data);
			}
		});*/
		MongoClient.connect(dbURL,{useUnifiedTopology:true},function(err,client){
			if(err) {
				return res.status(200).send(JSON.stringify({msg:"Conneciton Error: " + err}));
			} else {
				var dbo = client.db("ragel");

				dbo.collection("characters").find().toArray(function(err,data){
					client.close();
					if(err) {
						return res.status(200).send(JSON.stringify({msg:"Transmit Error: " + err}));
					} else {
						return res.status(200).send({msg:"SUCCESS",data:data});
					}
				});
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
