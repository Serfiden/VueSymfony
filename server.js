let WebSocketServer = require('websocket').server;
let http = require('http');
let server = http.createServer(function(req, res) {

});
let ClientModel = require('./src/Models/Client.js');
let BaristaModel = require('./src/Models/Barista.js');
let OrderModel = require('./src/Models/Order.js');

/** Both the clients and the baristas consts will be used to store the connections of these two types */

const clients = {

};

const baristas = {

};

const waitingQueue = [

];

const MESSAGE_TYPES = {
	CLIENT_CONNECT: 'CLIENT_CONNECT',
	ORDER: 'ORDER',
	BARISTA_CLOCK_IN: 'BARISTA_CLOCK_IN',
	BARISTA_CLOCK_OUT: 'BARISTA_CLOCK_OUT',
	BARISTA_ORDER_UPDATE: 'BARISTA_ORDER_UPDATE'
}

/** IMPORTANT: Currently unused const 
* Will be used to map the logic for each message type that is currently written in a big block
* below to the corresponding message type
*/

const MESSAGE_MAPPING = {
	'ORDER': () => {

	},
	'BARISTA_CLOCK_IN': () => {

	},
	'BARISTA_CLOCK_OUT': () => {

	},
	'BARISTA_ORDER_UPDATE': () => {

	}
}

const ORDER_STATUSES = {
	RECEIVED: 'RECEIVED',
	WAITING: 'WAITING',
	PROCESSED: 'PROCESSED',
	READY: 'READY'
}

server.listen(1337, function() {
	console.log("Server is listening on port 1337");
});

let wsServer = new WebSocketServer({
	httpServer: server
});

wsServer.on('request',	 function(req) {
	const connection = req.accept(null, req.origin);
	console.log((new Date()) + ' Connection from origin ' + req.origin);

	connection.on('message', function(message) {
		const data = JSON.parse(message.utf8Data);
		
		/** All the logic in the next conditional blocks will be handled by separate functions, in the near future,
		* according the mapping established in the MESSAGE_MAPPING const
		*/
		if (data.type === MESSAGE_TYPES.ORDER) {
			const clientID = data.clientID,
				orderInfo = data.info;

			/*
				
			*/

			/** If the message has been sent by a client, store the connection to him and his order */
			if (clients[clientID] === undefined) {
				clients[clientID] = {
					connection: connection,
					clientID: clientID,
					orderID: orderInfo.id,
					order: orderInfo.info,
					order_status: ORDER_STATUSES.RECEIVED
				}; 
			} else {
				clients[clientID].orderID = orderInfo.id;
				clients[clientID].order = orderInfo.info;
				clients[clientID].order_status = ORDER_STATUSES.RECEIVED;
			}

			connection.send('Your order has been received!');

			/** Sends the current order to the first available barista in the baristas object 
			* and notifies the client that his order has been sent to a barista and awaits confirmation
			*/

			for (key in baristas) {
				if (baristas.hasOwnProperty(key) && !baristas[key].busy_status) {
					baristas[key].connection.send(JSON.stringify(orderInfo));
					baristas[key].busy_status = true;
					baristas[key].clientID = clientID;
					baristas[key].orderID = orderInfo.id;
					clients[clientID].order_status = ORDER_STATUSES.PROCESSED;
					connection.send('Your order has been dispatched to a barista');
					break;
				}
			}

			/** If all the connected baristas are busy, add the current order at the end of a waiting queue 
			* The first element of the waiting queue is automatically processed by the first barista that 
			* becomes available
			*/

			if (clients[clientID].order_status !== ORDER_STATUSES.PROCESSED) {
				waitingQueue.push({
					clientID: clientID,
					orderID: orderInfo.id,
					info: orderInfo.order
				});
				clients[clientID].order_status = ORDER_STATUSES.WAITING;
				connection.send('All the baristas are busy! Your order will be processed soon');
			}

		} else if (data.type === MESSAGE_TYPES.BARISTA_CLOCK_IN) {
			baristas[data.baristaID] = {
				connection: connection,
				busy_status: false
			}
			if (waitingQueue.length !== 0) {
				let queuedOrder = waitingQueue.shift();
				baristas[data.baristaID].connection.send(JSON.stringify(queuedOrder.info))
			}
		} else if (data.type === MESSAGE_TYPES.BARISTA_CLOCK_OUT) {
			baristas[data.baristaID] = {
				connection: null,
				busy_status: true
			}
		} else if (data.type === MESSAGE_TYPES.BARISTA_ORDER_UPDATE) {
			const orderStatus = data.status;
			const clientID = baristas[data.baristaID].clientID;
			if (orderStatus === 'DONE') {
				baristas[data.baristaID].busy_status = false;
				clients[clientID].connection.send('Your order is now ready for you!');
			} else if (orderStatus === 'ACCEPT') {
				clients[clientID].connection.send('Your order has been accepted by a barista and is in progress!');
			} else if (orderStatus === 'DECLINE') {
				baristas[data.baristaID].busy_status = false;
				clients[clientID].connection.send('A barista has declined your order for the following reason: ' + data.comment);
			}
		}
	});
	connection.on('close', function(connection) {

	});
});