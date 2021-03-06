var express = require('express');
var expressApp = express();
var http = require('http').Server(expressApp);
var io = require('socket.io').listen(http);
var PORT = process.env.PORT || 5000;

var players = {};
var playerCount = 0;
var info = 
[
	{ name: "Crandall", color: "rgba(255,0,0,255)" },
	{ name: "Samlambda", color: "rgba(0,0,255,255)" },
	{ name: "Plorp", color: "rgba(255,0,255,255)" },
	{ name: "Grimmy", color: "rgba(255,255,0,255)" },
	{ name: "Tando", color: "rgba(0,255,255,255)" },
	{ name: "Blortch", color: "rgba(255,255,255,255)" },
	{ name: "Lazbee", color: "rgba(0,0,0,255)" },
];

expressApp.get('/', function(req, res) {
	res.sendFile(__dirname + '/game/index.html');
});

expressApp.use(express.static(__dirname + '/game'));

io.on('connection', function (socket) {
	// create a new player and add it to our players object
	if (playerCount <= 7)
	{
		players[socket.id] = {
			playerId: socket.id,
			pos: { x: Math.floor(Math.random() * 700) + 50, y: Math.floor(Math.random() * 500) + 50},
			info: info[playerCount],
			moves: 0,
		};
		playerCount++;
		// send the players object to the new player
		socket.emit('currentPlayers', players);
		// update all other players of the new player
		socket.broadcast.emit('newPlayer', players, players[socket.id]);
		
		console.log('a user connected and was added to the player list');
	}
	else
	{
		console.log('a user connected but the max number of players was already reached');
	}
  
	socket.on('disconnect', function () {
		console.log('a user disconnected');
		
		// emit a message to all players to remove this player
		io.emit('disconnect', players[socket.id].info.name);
		
		// remove this player from our players object
		delete players[socket.id];
		playerCount--;

	});
	
	// when a player moves, update the player data
	socket.on('playerMovement', function (movementData) {
		players[socket.id].pos = movementData;
		players[socket.id].moves++;
		// emit a message to all players about the player that moved
		socket.broadcast.emit('playerMoved', players[socket.id]);
	});
});

http.listen(PORT, function() {
	console.log('listening on localhost:5000');
});