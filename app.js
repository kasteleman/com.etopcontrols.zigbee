'use strict';

const Homey = require('homey');
const Log = require('homey-log').Log;

class etopcontrols extends Homey.App {
	onInit() {
		this.log('init');
	}
}


module.exports = etopcontrols;
