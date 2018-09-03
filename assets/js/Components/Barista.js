import EventBus from './EventBus.js';
import BaristaPartial from '../Templates/Barista.vue';
import WsConnection from '../Services/WebsocketClient.js';
import uuid from 'uuid/v4';

const STATUS_MESSAGES = {
	CLOCKED_IN: 'Awaiting orders...',
	CLOCKED_OUT: 'Good job today! Hope you\'re just as excited for tomorrow as our customers',
	JUST_ARRIVED: 'Hey yo! Press the \'Start shift\' button when you\'re ready for the customers!'
}


BaristaPartial.data = function() {
	return {
		/** @type {Number} */
		orderID: null,
		/** @type {WebSocket} */
		connection: null,
		/** @type {uuid} */
		baristaID: null,
		/** @type {boolean} - Indicates whether the barista is currently handling an order */
		hasOrder: false,
		/** @type {Object} */
		order: {},
		/** @type {uuid} - The ID of the client the current order belongs to */
		clientID: null,
		/** @type {string} - The barista's status, controlled by the Shift functions, to be displayed
		* in the view */ 
		status: STATUS_MESSAGES.JUST_ARRIVED
	}
};

BaristaPartial.created = function() {
	this.connection = new WsConnection('BARISTA', this.baristaID);
	this.baristaID = uuid();
}

BaristaPartial.methods = {
	/**
	* Make the current barista available for receiving orders
	*/
	startShift: function() {
		this.connection.onmessage = (message) => {
			const received = JSON.parse(message.data);
			this.assignOrder(received.info);
			this.clientID = received.clientID;
		}
		this.status = STATUS_MESSAGES.CLOCKED_IN;
		this.connection.send(JSON.stringify({
			type: 'BARISTA_CLOCK_IN',
			baristaID: this.baristaID,
			info: 'Barista clocked in',
		}));
	},

	/**
	* Render the current barista unavailable for further orders
	*/
	endShift: function() {
		this.status = STATUS_MESSAGES.CLOCKED_OUT;
		this.connection.send(JSON.stringify({
			type: 'BARISTA_CLOCK_OUT',
			baristaID: this.baristaID,
			info: 'Barista clocked out',
		}));
	},

	/**
	* @param {Object} order - Object that holds all the information concerning a new order
	* 
	*/
	assignOrder: function (order) {
		this.order = order.items;
		this.orderID = order.id;
	},

	/** 
	* Notify the server that the order is in progress
	*/
	acceptOrder: function () {
		this.connection.send(JSON.stringify({
			type: 'BARISTA_ORDER_UPDATE',
			baristaID: this.baristaID,
			clientID: this.clientID,
			orderID: this.orderID,
			status: 'ACCEPT',
			comment: null
		})); 
		this.hasOrder = true;
	},

	/**
	* @param {string} declineReason
	* Notify the server that the order that was assigned to the barista has been declined 
	*/
	declineOrder: function (declineReason = 'Order would take too long') {
		console.log(this.clientID);
		this.connection.send(JSON.stringify({
			type: 'BARISTA_ORDER_UPDATE',
			baristaID: this.baristaID,
			clientID: this.clientID,
			orderID: this.orderID,
			status: 'DECLINE',
			comment: declineReason
		}));
		this.order = {};
	},

	/**
	* When a product is ready for the client, remove it from the view
	*/
	productReady: function (item) {
		this.$delete(this.order, item);
		if (Object.keys(this.order).length === 0) {
			this.finishOrder();
		}
	},

	/**
	* Notify the server that the order has been finished and update the view accordingly
	*/
	finishOrder: function () {
		this.connection.send(JSON.stringify({
			type: 'BARISTA_ORDER_UPDATE',
			baristaID: this.baristaID,
			clientID: this.clientID,
			orderID: this.orderID,
			status: 'DONE',
			comment: null
		}));
		this.hasOrder = false;	
		this.orderID = null;
	}
};
export default BaristaPartial;

