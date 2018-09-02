import Cart from '../Templates/Cart.vue';
import EventBus from './EventBus.js';

Cart.props = [
	'items'
];

Cart.methods = {
	createOutput: function(item) {
		let totalPrice = (item.quantity * item.unitPrice).toFixed(2);
		return (item.name + ' x ' + item.quantity + ' - ' + totalPrice);
	},
	orderSubmit: function() {
		EventBus.$emit('order-submit');
	}
}

export default Cart;