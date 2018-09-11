const MESSAGE_MAPPING = {
	'ACCEPT': 'PROCESSED',
	'DECLINE': 'DECLINED',
	'DONE': 'READY',
}

class Barista {

	/** @param {uuid} baristaID
	* @param {WebSocketConnection} connection - the connection to the WebSocketServer of
	* 	the current barista
	*/
	constructor(baristaID, connection) {
		/** @type {uuid} */
		this.ID = baristaID;
		/** @type {WebSocketconnection} */
		this.connection = connection;
		/** @type {boolean} */
		this.busy = false;
		/** @type {Order} */
		this.order = null;
	}

	isBusy() {
		return this.busy;
	}

	getOrder() {
		return this.order;
	}

	/** 
	* @param {Order} order - the order that has been dispatched to this barista
	* Sends the order to the barista front-end model, sets its' status to PROCESSED and makes the
	* 	barista busy
	*/

	assignOrder (order) {
		this.connection.send(JSON.stringify({
			id: order.orderID,
			items: order.info
		}));
		this.busy = true;
		this.order = order;
		this.order.setStatus('PROCESSED');
	}

	/**
	* @param {string} status - the new status the order assigned to this barista will be given
	* Tells the order model to update its' status and updates the barista's status if necessary
	*/

	updateOrderStatus (status) {
		if (status !== 'DECLINE') {
			this.order.setStatus(MESSAGE_MAPPING[status]);
		}
		if (status === 'DONE' || status === 'DECLINE') {
			this.busy = false;
			this.order = null;
		}
	}
}

module.exports = Barista;