import EventBus from './EventBus.js';
import BaristaPartial from '../Templates/Barista.vue';
import WsConnection from '../Services/WebsocketClient.js';
import uuid from 'uuid/v4';

BaristaPartial.data = function() {
	return {
		/** @type {string} name - The full name of the barista */
		name: '',
		/** @type {Boolean} */
		busy: false,
		/** @type {Number} */
		orderID: null,
		/** @type {WebSocket} */
		connection: null,
		/** @type {uuid} */
		baristaID: null,
		/** @type {Object} */
		order: {} 
	}
};

BaristaPartial.props = [
	/** @type {Array<string>} specialties - List of unique recipes this barista can serve */
	'specialties'
];

BaristaPartial.created = function() {
	this.connection = new WsConnection('BARISTA', this.baristaID);
	this.baristaID = uuid();
}


BaristaPartial.methods = {
	/*
	* Returns the time when this barista will become available 
	*/
	availableAt: function () {
		return this.busyUntil;
	},

	/** 
	* @param {Object} order - Object that holds all the information concerning a new order
	* Render the current order in the barista view 
	*/
	receiveOrder: function (order) {
		this.order = order.items;
		this.orderID = order.id;
		this.busy = true;
		console.log('Received order'); 
	},

	/**
	* When a product is ready for the client, remove it from the view
	*/
	productReady: function () {
		
	},

	/**
	* Tells the parent component that the order is ready and makes the barista available
	*/
	dispatchOrder: function() {
		this.busy = false;
		this.busyUntil = null;
		EventBus.$emit('order-ready', this.orderID, this.name);
		this.orderID = null;
	},

	/**
	* Make the current barista available for receiving orders
	*/
	startShift: function() {
		this.connection.onmessage = (message) => {
			this.receiveOrder(JSON.parse(message.data));
		}
		this.connection.send(JSON.stringify({
			type: 'BARISTA_CLOCK_IN',
			baristaID: this.baristaID,
			info: 'Barista clocked in',
			busy_status: false
		}));
	},

	/**
	* Render the current barista unavailable for further orders
	*/
	endShift: function() {
		this.connection.send(JSON.stringify({
			type: 'BARISTA_CLOCK_OUT',
			baristaID: this.baristaID,
			info: 'Barista clocked out',
			busy_status: true
		}));
		this.connection.close();
	}
};
export default BaristaPartial;

