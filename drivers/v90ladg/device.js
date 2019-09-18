'use strict';

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class v90ladg extends ZigBeeDevice {

	onMeshInit() {
		this.printNode();
		this.enableDebug();

		// Register target_temperature capability
		// Setpoint of thermostat
		this.registerCapability('target_temperature', 'hvacThermostat', {
			set: 'occupiedHeatingSetpoint',
			setParser(value) {
				this.node.endpoints[0].clusters.hvacThermostat.write('occupiedHeatingSetpoint',
					Math.round(value * 1000 / 10))
					.then(res => {
						this.log('write occupiedHeatingSetpoint: ', res);
					})
					.catch(err => {
						this.error('Error write occupiedHeatingSetpoint: ', err);
					});
				return null;
			},
			get: 'occupiedHeatingSetpoint',
			reportParser(value) {
				return Math.round((value / 100) * 10) / 10;
			},
			report: 'occupiedHeatingSetpoint',
		});

		// reportlisteners for the occupiedHeatingSetpoint
		this.registerAttrReportListener('hvacThermostat', 'occupiedHeatingSetpoint', 300, 0, 10, data => {
			const parsedValue = Math.round((data / 100) * 10) / 10;
			this.log('occupiedHeatingSetpoint: ', data, parsedValue);
			this.setCapabilityValue('target_temperature', parsedValue);
		}, 0);

		// local temperature
		this.registerCapability('measure_temperature', 'hvacThermostat', {
			get: 'localTemp',
			reportParser(value) {
				return Math.round((value / 100) * 10) / 10;
			},
			report: 'localTemp',
			getOpts: {
				getOnLine: true,
				getOnStart: true,
			},
		});

		this.registerAttrReportListener('hvacThermostat', 'localTemp', 1, 300, 50, value => {
			const parsedValue = Math.round((value / 100) * 10) / 10;
			this.log('hvacThermostat - localTemp: ', value, parsedValue);
			this.setCapabilityValue('measure_temperature', parsedValue);
		}, 0);

	}

}

module.exports = v90ladg;
