let Order = require('./Order.js');

class Client {
	constructor (connection, clientID) {
		this.clientID = clientID;
		this.connection = connection;
		this.order = null; 
	}

	get ID () {
		return this.clientID;
	}

	get currentOrder () {
		return this.order;
	}

	get conn () {
		return this.connection;
	}

	createOrder (items) {
		this.order = new Order(items, this);
	}

	send (info) {
		this.connection.send(info);
	}
}

module.exports = Client;