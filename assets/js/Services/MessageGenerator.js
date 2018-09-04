const CLIENT_CONNECT = (data) => {
	return JSON.stringify({

	});
}

const ORDER = (clientID, orderID, orderItems) => {
	return JSON.stringify({
		type: 'ORDER',
		clientID: clientID,
		items: orderItems
	});
}

const BARISTA_CLOCK_IN = (baristaID, message) => {
	return JSON.stringify({
		type: 'BARISTA_CLOCK_IN',
		baristaID: baristaID,
	});
}

const BARISTA_CLOCK_OUT = (baristaID, message, hadOrder = false) => {
	return JSON.stringify({
		type: 'BARISTA_CLOCK_IN',
		baristaID: baristaID,
	});
}

const BARISTA_ORDER_UPDATE = (baristaID, orderID, status) => {
	const message = {
		type: 'BARISTA_ORDER_UPDATE',
		status: status,
		baristaID: baristaID,
	}
}

const ACCEPT_ORDER = (baristaID, orderID) => {
	return JSON.stringify({
		type: 'BARISTA_ORDER_UPDATE',
		status: 'ACCEPT',
		baristaID: baristaID,
	});
}

const DECLINE_ORDER = (baristaID, orderID, reason) => {
	return JSON.stringify({
		type: 'BARISTA_ORDER_UPDATE',
		status: 'DECLINE',
		baristaID: baristaID,
	});
}

const FINISH_ORDER = (baristaID, orderID) => {
	return JSON.stringify({
		type: 'BARISTA_ORDER_UPDATE',
		status: 'DONE',
		baristaID: baristaID,
	});
}

const MESSAGE_MAPPING = {
	'CLIENT_CONNECT': CLIENT_CONNECT,
	'ORDER': ORDER,
	'ACCEPT': ACCEPT_ORDER,
	'DECLINE': DECLINE_ORDER,
	'DONE': FINISH_ORDER,
	'BARISTA_CLOCK_IN': BARISTA_CLOCK_IN,
	'BARISTA_CLOCK_OUT': BARISTA_CLOCK_OUT,
}


export default function MessageGenerator (type, ...data) {
	return MESSAGE_MAPPING[type](...data);
}