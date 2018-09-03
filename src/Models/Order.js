let uuid = require('uuid/v4');

const 

class Order {
	/*
	* @param {Array<Item>} items
	* @param {Client} owner - The Client who created this order
	*/
	constructor(items, owner) {
		this.context = owner;
		this.ID = uuid();
		this.items = items;
		this.status = 'RECEIVED';
	}

	getOrderID() {
		return this.ID;
	}

	getOwnerID() {
		return this.context.getID();
	}

	getStatus() {
		return this.status;
	}

	setStatus(status) {
		this.status = status;
		this.context.onStatusUpdate();
	}

}

module.exports = Order;