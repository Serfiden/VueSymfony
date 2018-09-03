import Message from '../Services/MessageGenerator.js';

export default class Barista {
	constructor(id, name) {
		this.id = id;
		this.name = name;
		this.connection = new WsConnection('BARISTA', this.baristaID);
	}

	sendMessage(type, params) {
		this.connection.send(Message(type, params));
	}
}