import Vue from 'vue';
import Barista from '../Components/Barista.js';
import myVue from '../myVue.js';

Vue.use(myVue);

let vm = new Vue({
	el: 'main',
	components: {barista: Barista}
})