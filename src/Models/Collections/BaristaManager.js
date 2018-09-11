let Barista = require('../Barista.js');

class Baristas {
	constructor () {
		this.baristas = {};
	}

	get available () {
		for (let key in this.baristas) {
			if (this.baristas.hasOwnProperty(key) && !this.baristas[key].isBusy()) {
				return this.baristas[key];
			}
		}
		return null;
	}

	getBaristaByID (id) {
		if (this.baristas[id] === undefined) {
			return null
		}
		return this.baristas[id];
	}

	createBarista(connection, baristaID) {
		this.baristas[baristaID] = new Barista(baristaID, connection);
	}

}

module.exports = new Baristas();