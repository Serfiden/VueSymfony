class Connection {
	constructor(userType, userID) {
		this.connection = new WebSocket('ws://127.0.0.1:1337');
		this.connection.onopen = function() {
			console.log(userType + '#' + userID + ' connected to WebSocketServer on port 1337');
		}
		this.connection.onerror = function(error) {
			console.log(error);
		}
		this.connection.onmessage = function(message) {
			console.log(message);
		}
		return this.connection;
	}
}

export default Connection;

