var express = require('express');
var app = express();
var http = require('http').Server(app);


app.get('/', function(req, res) {
	res.sendFile(__dirname + '/game/index.html');
});

app.use(express.static('game'));

http.listen(3000, function() {
	console.log('listening on localhost:3000');
});