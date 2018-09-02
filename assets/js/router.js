import VueRouter from 'vue-router';

const routes = [
	{path: Routing.generate('login'), name: 'login'},
	{path: Routing.generate('client-menu'), name: 'client-menu'},
	{path: Routing.generate('barista-menu'), name: 'barista-menu'}
]

let router = new VueRouter({
	routes,
	mode: 'history'
});

export default routes;
export {router};