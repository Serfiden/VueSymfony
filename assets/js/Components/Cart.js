import Cart from '../Templates/Cart.vue';
import EventBus from './EventBus.js';

Cart.props = [
	'items'
];

Cart.methods = {
	/*
	* @param {Object} item - An item contained in the order passed to cart
	* Creates a custom output using the information in the item param, so that it can be rendered 
	*/
	createOutput: function(item) {
		let totalPrice = (item.quantity * item.unitPrice).toFixed(2);
		return (item.name + ' x ' + item.quantity + ' - ' + totalPrice);
	},

	/*
	* Signals that the order is ready to be sent to the server and removes it from the view
	*/
	orderSubmit: function() {
		EventBus.$emit('order-submit');
	}
}

export default Cart;