import CoffeeMenu from '../Templates/CoffeeMenu.vue';
import MenuData from '../../data/MenuData.json';
import EventBus from './EventBus.js';

CoffeeMenu.data = function() {
	return {
		items: MenuData
	}
}

CoffeeMenu.methods = {
	onAddClick: function(itemName, category) {
		EventBus.$emit('add-to-cart', {itemName: itemName, category: category});
	}
}

export default CoffeeMenu;