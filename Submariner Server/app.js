var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var util = require('util');
var exec = require('child_process').exec;
function execute(command, callback) {
  exec(command, function(error, stdout, stderr) { callback(stdout); });
};

var clients = [];
var life = 3;

// Interactable object states
var buttonPress = false;
var leverPull = false;
var crankTurn = false;
var handlePull = false;

// Character selection variables
var captainSelect = false;
var gunnerSelect = false;
var navigatorSelect = false;
var engineerSelect = false;

// Logic variables
var gameStart = false;
var gameOver = false;
var deciseconds = 0;

// Server events
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
		io.sockets.emit('depth', { text: data });
		leverPull = true;
	});

	socket.on('handle', function(data) {
		console.log(data);
	});

	socket.on('navigator crank', function(data) {
		console.log(data);
		io.sockets.emit('direction', { text: data });
		crankTurn = true;
	});

	socket.on('gunner handle', function(data) {
		console.log(data);
		handlePull = true;
	});

	// Character selection events
	socket.on('captain select', function(data) {
		console.log(data);
		captainSelect = true;
		io.sockets.emit('captain select', { text: 'Captain selected.' });
	});

	socket.on('gunner select', function(data) {
		console.log(data);
		gunnerSelect = true;
		io.sockets.emit('gunner select', { text: 'Gunner selected.' });
	});

	socket.on('navigator select', function(data) {
		console.log(data);
		navigatorSelect = true;
		io.sockets.emit('navigator select', { text: 'Navigator selected.' });
	});

	socket.on('engineer select', function(data) {
		console.log(data);
		engineerSelect = true;
		io.sockets.emit('engineer select', { text: 'Engineer selected.' });
	});
});

// The main game loop. Current logic:
// win = captain button, gunner handle, engine lever, navigator crank all activated.
// lose = wait 10 seconds.
var loop = function() {

	// Check for game start (all characters selected)
	if (captainSelect && gunnerSelect && 
			navigatorSelect && engineerSelect) {
		gameStart = true;
	}

	if (gameStart) {
	
		// Generate a task
		generateTask(function(state) {
			console.log(state);
		});
	
		// Check for victory
		if (buttonPress && leverPull && crankTurn && handlePull && !gameOver) {
			gameOver = true;
			console.log("sending win");
			io.sockets.emit('win', { text: 'You win!' });

			// Reset the game
			resetGame();
		}

		// Check for defeat
		if (deciseconds >= 600 && !gameOver) {
			life--;
			if (life == 0) {
				gameOver = true;
				console.log("sending lose");
				io.sockets.emit('lose', { text: 'You lose!' });

				// Reset the game
				resetGame();
			} else {
				deciseconds = 0; //reset so this can continue
				io.sockets.emit('health_down',{ text: 'Wrong!  Your health now goes down by one.'});
				console.log("health down");
			}

		}

		// Increment timer
		deciseconds++;
	}
};
setInterval(loop, 100);

// Reset the game to its initial state.
var resetGame = function() {
	buttonPress = false;
	leverPull = false;
	crankTurn = false;
	handlePull = false;

	captainSelect = false;
	gunnerSelect = false;
	navigatorSelect = false;
	engineerSelect = false;

	gameStart = false;
	gameOver = false;
	deciseconds = 0;
};

// Generate a task
var generateTask = function(callback) {
	execute("SubmarinerHelper.exe", function(object) {
		callback({ state: object });
	});
};

// Launch the server.
http.listen(3000, function() {
	console.log('Submariner server listening on port 3000.');
});