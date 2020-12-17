const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
	const dbURL = (process.env.DB_URI || "mongodb://localhost") + ":27017";
const path = require("path");



var services = function services(app) {
	
	app.post('/write-character',function(req,res){
	var newData = JSON.parse(req.body.data);

	MongoClient.connect(dbURL,{useUnifiedTopology:true},function(err,client){
		if(err) {
			return res.status(200).send(JSON.stringify({msg:"Connection Error: " + err}));
		} else {
			var dbo = client.db("ragel");
				dbo.collection("characters").insertOne(newData,function(err,response){
				client.close();
				if(err) {
					return res.status(200).send(JSON.stringify({msg:"Sending Error: " + err}));
				} else {
					return res.status(200).send(JSON.stringify({msg:"SUCCESS"}));
				}
			});
		}
	});
});

app.post('/delete-records', function(req,res) {
	var deleteid = req.body.id;
	MongoClient.connect(dbURL,{useUnifiedTopology:true},function(err,client){
		if(err) {
			return res.status(200).send(JSON.stringify({msg:"Connection Error: " + err}));
		} else {
			var dbo = client.db("ragel");
			var query = {"ID":deleteid};
				dbo.collection("characters").deleteOne(query,function(err,response){
				if(err) {
					client.close();
					return res.status(200).send(JSON.stringify({msg:"Sending Error: " + err}));
				} else {
//					return res.status(200).send(JSON.stringify({msg:"SUCCESS"}));	
					dbo.collection("characters").find().toArray(function(err,data){
					client.close();
					if(err) {
						return res.status(200).send(JSON.stringify({msg:"Transmit Error: " + err}));
					} else {
						return res.status(200).send({msg: "SUCCESS"});
					}
				});
					//
				}
			});
		}
	});
	});

	
	
	app.put('/update-character',function(req,res){
	var newData = JSON.parse(req.body.data);
		
	var query = { 'ID' : newData.ID };
	newData = { $set : newData };

	MongoClient.connect(dbURL,{useUnifiedTopology:true},function(err,client){
		if(err) {
			return res.status(200).send(JSON.stringify({msg:"Connection Error: " + err}));
		} else {
			var dbo = client.db("ragel");
				dbo.collection("characters").updateOne(query,newData,function(err,response){
				client.close();
				if(err) {
					return res.status(200).send(JSON.stringify({msg:"Sending Error: " + err}));
				} else {
					return res.status(200).send(JSON.stringify({msg:"SUCCESS"}));
				}
			});
		}
	});/**/
	});
}

module.exports = services;
