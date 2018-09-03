let Order = require('./Order.js');

class Client {
	constructor(connection, clientID) {
		this.clientID = clientID; 
		this.connection = connection;
		this.order = null;
	}

	getID() {
		return this.clientID;
	}

	getConnection() {
		return this.connection;
	}

	getOrder() {
		return this.order;
	}

	createOrder(items) {
		this.order = new Order(items, this);
	}

	onStatusUpdate() {
		
	}
}

module.exports = Client;