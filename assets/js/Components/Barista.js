import EventBus from './EventBus.js';
import BaristaPartial from '../Templates/Barista.vue';
import WsConnection from '../Services/WebsocketClient.js';
import uuid from 'uuid/v4';
import Message from '../Services/MessageGenerator.js';
import model from '../Models/Barista.js';

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
		* in the view 
		*/ 
		status: STATUS_MESSAGES.JUST_ARRIVED,
		/** @type {Barista} */
		model: null,
	}
};



BaristaPartial.created = function() {
	this.baristaID = uuid();
	this.model = new model(this);
}

BaristaPartial.methods = {
	/**
	* Make the current barista available for receiving orders
	*/
	startShift: function() {
		this.status = STATUS_MESSAGES.CLOCKED_IN;
		this.model.send('BARISTA_CLOCK_IN', 'Barista clocked in!');

	},

	/**
	* Render the current barista unavailable for further orders
	*/
	endShift: function() {
		this.status = STATUS_MESSAGES.CLOCKED_OUT;
		this.order = {};
		this.orderID = null;
		this.hasOrder = false;
		this.clientID = null;
		this.model.send('BARISTA_CLOCK_OUT', 'Barista clocked out!');
	},

	/**
	* @param {Object} order - Object that holds all the information concerning a new order
	* 
	*/
	assignOrder: function (order, clientID) {
		this.order = order.items;
		this.orderID = order.id;
		this.clientID = clientID;
	},

	/** 
	* Notify the server that the order is in progress
	*/
	acceptOrder: function () {
		this.model.send('ACCEPT', this.clientID, this.orderID);
		this.hasOrder = true;
	},

	/**
	* @param {string} declineReason
	* Notify the server that the order that was assigned to the barista has been declined 
	*/
	declineOrder: function (declineReason = 'Order would take too long') {
		this.model.send('DECLINE', this.clientID, this.orderID, declineReason);
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
		this.model.send('DONE', this.clientID, this.orderID);
		this.hasOrder = false;	
		this.orderID = null;
	}
};
export default BaristaPartial;

