import {router} from './router.js';

const myVue = {
	install(Vue, options){
		Vue.use(router);
		Vue.delimiters = ['${', '}'];
	}
}

export default myVue;