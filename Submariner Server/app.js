var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var util = require('util');
var exec = require('child_process').exec;
function execute(command, callback) {
  exec(command, function(error, stdout, stderr) { callback(stdout); });
};

var clients = [];

// Interactable object states
var depth = 0;
var direction = 0;
var torpedoColor = "Red";

// Character selection variables
var captainSelect = false;
var gunnerSelect = false;
var navigatorSelect = false;
var engineerSelect = false;

// Logic variables
var life = 3;
var gameStart = false;
var gameOver = false;
var globalSeconds = 0;
var taskSeconds = 0;
var taskOver = true;
var startDelay = 70;

// Task variables
var lowerBoundDirection = 30;
var upperBoundDirection = 80;
var targetTorpedoColor = "Red";
var timeLimit = 600;
var lowerBoundDepth = 30;
var upperBoundDepth = 80;

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
	
	socket.on('engine lever', function(data) {
		console.log(data);
		io.sockets.emit('depth', { text: data });
		depth = parseInt(data);
	});

	socket.on('navigator crank', function(data) {
		console.log(data);
		io.sockets.emit('direction', { text: data });
		direction = parseInt(data);
	});

	socket.on('gunner handle', function(data) {
		console.log(data);
		torpedoColor = data;
		
		// Check for victory
		if (depth <= upperBoundDepth && depth >= lowerBoundDepth
			&& direction  <= upperBoundDirection && direction >= lowerBoundDirection
			&& torpedoColor.localeCompare(targetTorpedoColor) && taskSeconds <= timeLimit && !gameOver) {
			
			// If correct, proceed to next task.
			taskOver = true;
			taskSeconds = 0;
			console.log("Task succeeded!");
		} else {
			
			// Task completed incorrectly.
			issueStrike();
		}
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

	// Busy events
	socket.on('engine_pipe', function(data) {
		console.log("engine pipe fix expired!");
		issueStrike();
	})
});

// The main game loop. Current logic:
// win = captain button, gunner handle, engine lever, navigator crank all activated.
// lose = wait 10 seconds.
var loop = function() {

	// Check for game start (all characters selected)
	/*
	if (captainSelect && gunnerSelect && 
			navigatorSelect && engineerSelect) {
		gameStart = true;
	}
	*/
	if (captainSelect) {
		startDelay--;
	}
	
	if (startDelay <= 0) {
		gameStart = true;
	}
	
	if (gameStart) {
	
		// Generate a task.
		if (taskOver) {
			taskOver = false;
			generateTask(function(state) {
				console.log(state);
				taskParser(state.state);
			});
		}
	
		// Check for game end.
		if (globalSeconds >= 1200 && !gameOver) {
			console.log("sending win");
			io.sockets.emit('win', { text: 'You win!' });
			gameOver = true;

			// Reset the game
			resetGame();
		}

		// Check for defeat
		if (taskSeconds >= timeLimit && !gameOver) {
			issueStrike();
		}

		// Emit current depth.
		io.sockets.emit('current depth', depth);
		
		// Emit current direction.
		io.sockets.emit('current direction', direction);
		
		// Handle timers
		taskSeconds++;
		globalSeconds++;
	}
};
setInterval(loop, 100);

// Reset the game to its initial state.
var resetGame = function() {
	buttonPress = false;
	depth = false;
	direction = false;
	torpedoColor = false;

	captainSelect = false;
	gunnerSelect = false;
	navigatorSelect = false;
	engineerSelect = false;

	gameStart = false;
	gameOver = false;
	deciseconds = 0;
	
	life = 4; // Fuck this bug TODO
};

// Issue a strike to the players.
var issueStrike = function() {
	life--;
	console.log("Current life: " + life);
	if (life === 0) {
		gameOver = true;
		console.log("sending lose");
		io.sockets.emit('lose', { text: 'You lose!' });

		// Reset the game
		resetGame();
	} else {
		taskOver = true
		taskSeconds = 0;
		console.log("task time out");
		io.sockets.emit('health_down',{ text: 'Wrong! Your health now goes down by one.'});
		console.log("health down");
	}
};

// Generate a task
var generateTask = function(callback) {
	execute("SubmarinerHelper.exe", function(object) {
		callback({ state: object });
	});

};

var taskParser = function (completeTask) {
	var taskComponents = completeTask.split(";");
	var specificTask;
	specificTask = (taskComponents[0]).split(":");
	upperBoundDepth = parseInt(specificTask[1]);
	specificTask = (taskComponents[1]).split(":");
	lowerBoundDepth = parseInt(specificTask[1]);
	specificTask = (taskComponents[2]).split(":");
	upperBoundDirection = parseInt(specificTask[1]);
	specificTask = (taskComponents[3]).split(":");
	lowerBoundDirection = parseInt(specificTask[1]);
	specificTask = (taskComponents[4]).split(":");
	timeLimit = (parseInt(specificTask[1]) * 10);
	specificTask = (taskComponents[5]).split(":");
	torpedoColor = specificTask[1];
	
	console.log("u_depth: " + upperBoundDepth);
	console.log("l_depth: " + lowerBoundDepth);
	console.log("u_direction: " + upperBoundDirection);
	console.log("l_direction: " + lowerBoundDirection);
	console.log("timeLimit: " + timeLimit);
	console.log("torpedoColor: " + torpedoColor);
	
	// Get target depth, direction, and color.
	var depth = ((upperBoundDepth + lowerBoundDepth) / 2);
	var direction = ((upperBoundDirection + lowerBoundDirection) / 2);
	var instruction = ("Depth: " + depth + "\nDirection: " + direction + "\nTorpedo: " + torpedoColor);
	console.log("instruction: " + instruction);
	io.sockets.emit('instruction', instruction);
}

// Launch the server.
http.listen(3000, function() {
	console.log('Submariner server listening on port 3000.');
});