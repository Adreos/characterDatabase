const express = require('express'), fs = require('fs'), bodyParser = require('body-parser'), path = require('path');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + '/../client/browsecharacter.html')));
console.log(path.join(__dirname + '/../client'));
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
//Default GET
app.get('/',function(req,res){
	res.status(200).sendFile(path.join(__dirname + '/../client/browsecharacter.html'));
});

//Wildcard GET
app.get('/*',function(req,res){
	res.status(200).sendFile(path.join(__dirname + '/../client' + req._parsedOriginalUrl.href));

});

app.listen(5000);
console.log('sever is running...');
