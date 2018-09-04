let WebSocketServer = require('websocket').server;
let http = require('http');
let server = http.createServer(function(req, res) {

});
let ACTIONS = require('./adapters/Actions.js');

server.listen(1337, function() {
	console.log("Server is listening on port 1337");
});

let wsServer = new WebSocketServer({
	httpServer: server
});

wsServer.on('request',	 function(req) {
	const connection = req.accept(null, req.origin);
	console.log((new Date()) + ' Connection from origin ' + req.origin);

	connection.on('message', function(message) {
		const data = JSON.parse(message.utf8Data);
		ACTIONS(...Object.values(data), connection);
	});
	connection.on('close', function(connection) {

	});
});