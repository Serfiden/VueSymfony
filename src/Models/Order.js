let uuid = require('uuid/v4');

const STATUS_MESSAGES = {
	'RECEIVED': 'Your order has been received!',
	'WAITING': 'All the baristas are busy! Your order will be processed soon!',
	'PROCESSED': 'Your order has been accepted by a barista and is in progress!',
	'READY': 'Your order is now ready for you!',
	'DECLINED': 'Your order has been returned to the top of the waiting queue',
}

class Order {
	/*
	* @param {Array<Item>} items
	* @param {Client} owner - The Client who created this order
	*/
	constructor(items, owner) {
		this.context = owner;
		this.ID = uuid();
		this.items = items;
		this.setStatus('RECEIVED');
	}

	get orderID () {
		return this.ID;
	}

	get ownerID () {
		return this.context.getID();
	}

	get order_status () {
		return this.status;
	}

	get info () {
		return this.items;
	}

	setStatus(status) {
		this.status = status;
		this.context.send(STATUS_MESSAGES[status]);
	}
}

module.exports = Order;