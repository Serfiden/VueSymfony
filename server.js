let WebSocketServer = require('websocket').server;
let http = require('http');
let server = http.createServer(function(req, res) {

});

const clients = {

};

const baristas = {

};

const waitingQueue = [

];

const MESSAGE_TYPES = {
	ORDER: 'ORDER',
	BARISTA_CLOCK_IN: 'BARISTA_CLOCK_IN',
	BARISTA_CLOCK_OUT: 'BARISTA_CLOCK_OUT',
	BARISTA_ORDER_UPDATE: 'BARISTA_ORDER_UPDATE'
}

const MESSAGE_MAPPING = {
	ORDER: () => {

	},
	BARISTA_CLOCK_IN: () => {

	},
	BARISTA_CLOCK_OUT: () => {

	},
	BARISTA_ORDER_UPDATE: () => {

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
	let connection = req.accept(null, req.origin);
	console.log((new Date()) + ' Connection from origin ' + req.origin);

	connection.on('message', function(message) {
		const data = JSON.parse(message.utf8Data);
		console.log(data.type);
		if (data.type === MESSAGE_TYPES.ORDER) {
			/** If the message has been sent by a client, store the connection to him and his order */
			if (clients[data.clientID] === undefined) {
				clients[data.clientID] = {
					connection: connection,
					order: data.info,
					order_status: ORDER_STATUSES.RECEIVED
				}; 
			} else {
				clients[data.clientID].order = data.info;
			}

			connection.send('Your order has been received!');

			/** Sends the current order to the first available barista in the baristas object 
			* and notifies the client that his order has been sent to a barista and awaits confirmation
			*/

			for (key in baristas) {
				if (baristas.hasOwnProperty(key)) {
					if (!baristas[key].busy_status) {
						baristas[key].connection.send(JSON.stringify(clients[data.clientID].order));
						baristas[key].busy_status = true;
						clients[data.clientID].order_status = ORDER_STATUSES.PROCESSED;
						connection.send('Your order has been dispatched to a barista');
						break;
					}
				}
			}

			/** If all the connected baristas are busy, add the current order at the end of a waiting queue 
			* The first element of the waiting queue is automatically processed by the first barista that 
			* becomes available
			*/

			if (clients[data.clientID].order_status === ORDER_STATUSES.RECEIVED) {
				waitingQueue.push({
					clientID: data.clientID,
					info: data.info
				});
				clients[data.clientID].order_status = ORDER_STATUSES.WAITING;
				connection.send('All the baristas are busy! Your order will be processed soon');
			}

		} else if (data.type === MESSAGE_TYPES.BARISTA_CLOCK_IN) {
			baristas[data.baristaID] = {
				connection: connection,
				busy_status: false
			}
		} else if (data.type === MESSAGE_TYPES.BARISTA_CLOCK_OUT) {
			baristas[data.baristaID] = {
				connection: null,
				busy_status: true
			}
		} else if (data.type === MESSAGE_TYPES.BARISTA_ORDER_UPDATE) {

		}
	});
	connection.on('close', function(connection) {

	});
});