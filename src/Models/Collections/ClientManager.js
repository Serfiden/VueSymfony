let Client = require('../Client.js');

class Clients {
	constructor() {
		this.clients = {};
	}

	getClientByID (id) {
		if (this.clients[id] === undefined) {
			return null;
		}
		return this.clients[id];
	}

	createClient (connection, clientID) {
		this.clients[clientID] = new Client(connection, clientID);
	}
}

module.exports = new Clients();