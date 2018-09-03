import Message from '../Services/MessageGenerator.js';
import WsConnection from '../Services/WebsocketClient.js';
import uuid from 'uuid/v4';

export default class Barista {
	/*
	* @param {Vue} ctx - The Vue instance that corresponds to the model
	*/
	constructor(ctx, name = "John Doe") {
		/** @type {uuid} id - The ID of the barista that corresponds to this model */
		this.id = uuid();
		/** @type {string} name - The full name of this barista */
		this.name = name;
		/** @type {Vue} */
		this.context = ctx;
		/** @type {WebSocket} connection - The connection object of this barista */
		this.connection = new WsConnection('BARISTA', this.id);
		this.connection.onmessage = (message) => {
			let received = JSON.parse(message.data);
			this.context.assignOrder(received.info);
		}
	}

	/*
	* @param {string} type - The type of message that has to be sent to the server
	* @param {Array} data - Array of all the data that the message should contain
	*/
	send(type, ...data) {
		this.connection.send(Message(type, this.id, ...data));
	}
}