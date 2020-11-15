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

//Service Listeners
app.post('/write-character',function(req,res){
	var data = req.body.data;
//	Debug Log command, unneed but left for easy debug
//	console.log(data);

	if(fs.existsSync(outputFile)) {
		data = "," + data;
	}
	fs.appendFile(outputFile,data,function(err){
		if(err) {
			res.send(err);
		} else {
			res.send("SUCCESS");
		}
	});
});
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
app.post('/delete-records', function(req,res) {
	var deleteid = req.body.id;
		fs.readFile(outputFile,"utf8",function(err,data){
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
		});
	});
//Default GET
app.get('/',function(req,res){
	res.status(200).sendFile(path.join(__dirname + '/../client/index.html'));
});

//Wildcard GET
app.get('/*',function(req,res){
	res.status(200).sendFile(path.join(__dirname + '/../client' + req._parsedOriginalUrl.pathname));

});

app.listen(5000);
console.log('sever is running...');
