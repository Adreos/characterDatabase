const path = require("path");

var services = function services(app) {
	
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
}

module.exports = services;
