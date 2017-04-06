var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var util = require('util');
var clients = [];

var buttonPress = false;
var leverPull = false;
var crankTurn = false;
var handlePull = false;

io.on('connection', function(socket) {
	clients.push(socket.id);
	var clientConnectedMsg = 'User connected ' + util.inspect(socket.id) + ', total: ' + clients.length;
	console.log(clientConnectedMsg);
	
	// Disconnect event
	socket.on('disconnect', function(data) {
		clients.pop(socket.id);
		var clientDisconnectedMsg = 'User disconnected ' + util.inspect(socket.id) + ', total: ' + clients.length;
		console.log(clientDisconnectedMsg);
	});
	
	socket.on('button', function(data) {
		console.log(data);
		buttonPress = true;
	});
	
	socket.on('engine lever', function(data) {
		console.log(data);
		leverPull = true;
	});

	socket.on('handle', function(data) {
		console.log(data);
	});

	socket.on('navigator crank', function(data) {
		console.log(data);
		crankTurn = true;
	});

	socket.on('gunner handle', function(data) {
		console.log(data);
		handlePull = true;
	});
});

var gameOver = false;

//win = captain button, gunner handle, engine lever, navigator crank

var loop = function() {
	if (buttonPress && leverPull && crankTurn && handlePull && !gameOver) {
		gameOver = true;
		console.log("sending win");
		io.sockets.emit('win', { text: 'You win!' });
	}
};

setInterval(loop, 1000);

http.listen(3000, function() {
	console.log('Submariner server listening on port 3000.');
});