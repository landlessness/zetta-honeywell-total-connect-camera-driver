var Scout = require('zetta-scout');
var util = require('util');
var HoneywellTotalConnectCamera = require('./honeywell_total_connect_camera');
var CAMERA_DEVICE_CLASS_ID = 2;

var HoneywellTotalConnectCameraScout = module.exports = function() {
  Scout.call(this);
};
util.inherits(HoneywellTotalConnectCameraScout, Scout);

HoneywellTotalConnectCameraScout.prototype.init = function(next) {
  var cameraQuery = this.server.where({ type: 'camera' });
  var soapQuery = this.server.where({ type: 'soap' });

  var self = this;
  
  this.server.observe(soapQuery, function(honeywellSoap) {
    for (i=0; i < honeywellSoap.deviceLocations.length; i++) {
      console.log('device list: ' + util.inspect(honeywellSoap.deviceLocations[i].DeviceList.DeviceInfoBasic));
      var deviceLocation = honeywellSoap.deviceLocations[i];
      cameraDevices = deviceLocation.DeviceList.DeviceInfoBasic.filter(function(device) {
        return device.DeviceClassID === CAMERA_DEVICE_CLASS_ID;
      });
      for (j=0; j < cameraDevices.length; j++) {
        var cameraDevice = cameraDevices[i];
        (function(deviceLocation, cameraDevice){
          console.log('deviceLocation.LocationID: ' +  deviceLocation.LocationID);
          console.log('cameraDevice.DeviceID: ' + cameraDevice.DeviceID);
          var query = self.server.where({type: 'camera', locationID: deviceLocation.LocationID, deviceID: cameraDevice.DeviceID});
          self.server.find(query, function(err, results) {
            if (results[0]) {
              self.provision(results[0], HoneywellTotalConnectCamera, honeywellSoap, cameraDevice, deviceLocation);
            } else {
              self.discover(HoneywellTotalConnectCamera, honeywellSoap, cameraDevice, deviceLocation);
            }
          });
        })(deviceLocation, cameraDevice);
      }
    }
    next();
  });
}