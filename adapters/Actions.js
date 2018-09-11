let Clients = require('../src/Models/Collections/ClientManager.js');
let Baristas = require('../src/Models/Collections/BaristaManager.js');
let WaitingQueue = require('../src/Models/Collections/WaitingQueue.js');

const ORDER_STATUSES = {
	RECEIVED: 'RECEIVED',
	WAITING: 'WAITING',
	PROCESSED: 'PROCESSED',
	READY: 'READY'
}

const ORDER = (clientID, orderItems, connection) => {
	if (Clients.getClientByID(clientID) === null) {
		Clients.createClient(connection, clientID);
	}
	Clients.getClientByID(clientID).createOrder(orderItems);
	if (Baristas.available === null) {
		WaitingQueue.push(Clients.getClientByID(clientID).currentOrder);
	} else {
		Baristas.available.assignOrder(Clients.getClientByID(clientID).currentOrder);
	}
}

const BARISTA_CLOCK_IN = (baristaID, connection) => {
	if (Baristas.getBaristaByID(baristaID) === null) {
		Baristas.createBarista(connection, baristaID);
	}
	if (WaitingQueue.isEmpty() === false) {
		Baristas.getBaristaByID(baristaID).assignOrder(WaitingQueue.pop());
	}
}

const BARISTA_CLOCK_OUT = (baristaID) => {

}

const BARISTA_ORDER_UPDATE = (status, baristaID) => {
	if (status === 'DECLINE') {
		WaitingQueue.push(Baristas.getBaristaByID(baristaID).getOrder());
	} 
	Baristas.getBaristaByID(baristaID).updateOrderStatus(status);
}

const ACTIONS = {
	'ORDER': ORDER,
	'BARISTA_CLOCK_IN': BARISTA_CLOCK_IN,
	'BARISTA_CLOCK_OUT': BARISTA_CLOCK_OUT,
	'BARISTA_ORDER_UPDATE': BARISTA_ORDER_UPDATE,
}

const ActionMapping = (type, ...data) => {
	return ACTIONS[type](...data);
}

module.exports = ActionMapping;