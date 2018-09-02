import Main from '../Templates/Main.vue';
import CoffeeMenu from './CoffeeMenu.js';
import Cart from './Cart.js';
import menuData from '../../data/MenuData.json';
import EventBus from './EventBus.js';
import WsConnection from '../Services/WebsocketClient.js';
import uuid from 'uuid/v4';

Main.data = function() {
	return {
		order: {},
		connection: null,
		clientID: null
	}
};

Main.created = function() {
	this.clientID = uuid();
	this.connection = new WsConnection('CLIENT', this.clientID);
	EventBus.$on('order-submit', () => {
		return this.orderSubmit();
	});
	EventBus.$on('add-to-cart', (item) => {
		return this.onItemAdd(item);
	});
}

Main.methods = {
	onItemAdd: function (orderItem) {
		const {itemName, category} = orderItem;
		if (this.order[itemName] === undefined) {
			this.$set(this.order, itemName, {
				name: itemName, 
				quantity: 1, 
				unitPrice: menuData[category][itemName].price 
			});
		} else {
			this.order[itemName].quantity ++;
		}
	},
	orderSubmit: function () {
		this.connection.send(JSON.stringify({
			type: 'ORDER',
			clientID: this.clientID,
			info: {
				id: uuid(),
				items: this.order
			}
		}));
	}
};

Main.components = {
	coffeeMenu: CoffeeMenu,
	coffeeCart: Cart
};

export default Main;