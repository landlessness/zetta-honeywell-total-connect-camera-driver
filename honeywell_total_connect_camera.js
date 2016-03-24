// http://video.alarmnet.com/img/snapshot.cgi?
// MAC=000E8F41C2B9 <- this comes from the device info response GetLocationCameraList & 
// &size=2
// &Random=1804289383 <- this seems to be just a random number
// &quality=3
// &GUID=5A0C9645-1464-4694-8B80-E437F0989192 <- I don't know how this is generated and it seems to matter

// http://video.alarmnet.com/img/snapshot.cgi?MAC=000E8F41C2B9&size=3&Random=719885386&quality=5&GUID=3E0357BD-7641-4EE8-9E60-1D1C15D06BA8

var HoneywellDevice = require('zetta-honeywell-total-connect-driver');
var util = require('util');

var TIMEOUT = 2000;

var HoneywellTotalConnectCamera = module.exports = function() {
  HoneywellDevice.call(this, arguments[0], arguments[1], arguments[2].LocationID);

};
util.inherits(HoneywellTotalConnectCamera, HoneywellDevice);

// TODO: check the actual status of the panel then set current state
HoneywellTotalConnectCamera.prototype.init = function(config) {

  config
    .name(this.deviceName)
    .type('camera')
    .state('ready')
    .when('ready', {allow: ['make-not-ready']})
    .when('not-ready', {allow: ['make-ready']})
    .map('make-ready', this.makeReady)
    .map('make-not-ready', this.makeNotReady)
    .map('update-state', this.updateState, [{name: 'newState', type: 'text'}]);
    
};

HoneywellTotalConnectCamera.prototype.makeReady = function(cb) {
  this.state = 'ready';
  cb();
}

HoneywellTotalConnectCamera.prototype.makeNotReady = function(cb) {
  this.state = 'not-ready'
  cb();
}
