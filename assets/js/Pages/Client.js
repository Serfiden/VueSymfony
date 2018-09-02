import Vue from 'vue';
import Main from '../Components/Main.js';
import myVue from '../myVue.js';

Vue.use(myVue);

let vm = new Vue({
	el: 'main',
	components: {mainMenu: Main}
})