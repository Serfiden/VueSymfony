import LoginPartial from '../Templates/Login.vue';
import {router} from '../router.js';

LoginPartial.methods = {
	toClient: function() {
		console.log('sal');
		window.location = router.resolve({name: 'client-menu'}).href;
	},
	toBarista: function() {
		window.location = router.resolve({name: 'barista-menu'}).href;
	}
}

LoginPartial.router = router;

export default LoginPartial;