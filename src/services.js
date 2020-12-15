const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
	const dbURL = (process.env.DB_URI || "mongodb://localhost") + ":27017";
const path = require("path");



var services = function services(app) {
	
	app.post('/write-character',function(req,res){
	var newData = JSON.parse(req.body.data);

//	Debug Log command, unneed but left for easy debug
//	console.log(newData);

/*	if(fs.existsSync(outputFile)) {
		data = "," + data;
	}
	fs.appendFile(outputFile,data,function(err){
		if(err) {
			res.send(err);
		} else {
			res.send("SUCCESS");
		}
	});*/
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
/*		fs.readFile(outputFile,"utf8",function(err,data){
			if(err) {
				res.send(err);
			} else {
				var olddata = JSON.parse("[" + data + "]"), newdata = new Array();
				for(var x=0;x<olddata.length;x++)
				{
					if(olddata[x].ID != deleteid)
						newdata.push(olddata[x]);
				}
				data = JSON.stringify(newdata);
				data = data.substring(1,(data.length-1));
				fs.writeFile(outputFile,data,function(err){
					if(err) {
						res.send(err);
					} else {
						res.send("[" + data + "]");
					}
				});
			}
		});*/
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
						return res.status(200).send(JSON.stringify(data));
					}
				});
					//
				}
			});
		}
	});
	});
}

module.exports = services;
