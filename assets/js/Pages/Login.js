import Vue from 'vue';
import Login from '../Components/Login.js';
import myVue from '../myVue.js';

Vue.use(myVue);

let vm = new Vue({
	el: 'main',
	components: {login: Login}
})