const MESSAGE_MAPPING = {
	'ACCEPT': 'PROCESSED',
	'DECLINE': 'DECLINED',
	'DONE': 'READY',
}

class Barista {
	constructor(baristaID, connection) {
		this.ID = baristaID;
		this.connection = connection;
		this.busy = false;
		this.order = null;
	}

	get busy_status () {
		return this.busy;
	}

	assignOrder (order) {
		this.connection.send(JSON.stringify({
			id: order.orderID,
			items: order.info
		}));
		this.busy = true;
		this.order = order;
		this.order.setStatus('PROCESSED');
	}

	updateOrderStatus (status) {
		this.order.setStatus(MESSAGE_MAPPING[status]);
		console.log(status);
		if (status === 'DONE' || status === 'DECLINE') {
			this.busy = false;
			this.order = null;
		}
	}
}

module.exports = Barista;