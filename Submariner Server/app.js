var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var util = require('util');
var clients = [];

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
	});
	
	socket.on('lever', function(data) {
		console.log(data);
	});

	socket.on('handle', function(data) {
		console.log(data);
	});
});


http.listen(3000, function(){
	console.log('Submariner server listening on port 3000.');
});