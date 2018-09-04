let Order = require('../Order.js');

class Queue {
	constructor () {
		this.orders = [];
	}

	push (order) {
		this.orders.push(order);
		order.setStatus('WAITING');
	}

	isEmpty () {
		if (this.orders.length === 0) {
			return true;
		} 
		return false;
	}
 
 	pop () {
 		return this.orders.shift();
 	}
}

module.exports = new Queue();