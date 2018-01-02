const request = require('request'),
 si = require('systeminformation');
 
 let ApiUrl = 'http://localhost:3000/license/';
 
 class LicenceService {

  constructor() {  }
getLicence(email, password){   
     return new Promise((resolve) => {

         var cpuBrand = '';
         var platform ='';
         var hardDiskDetails='';
         var macDetails ='';     
         si.cpu()
    .then(cpu => {
cpuBrand = cpu.brand;
   si.osInfo()
    .then(osInfo => {
 platform = osInfo.platform;
 si.blockDevices().then(blockDevices => {    
    hardDiskDetails = blockDevices[0].uuid;
    si.networkInterfaces().then(networkInterfaces => { 
macDetails = networkInterfaces[0].mac;
    var object = {
         cpuIdDetails :{
             brand : cpuBrand         }, 
          osPlatform : platform,          
          hardDiskDetails : hardDiskDetails,
          macDetails : macDetails,
          EmailId : email,
          Password : password
    }

   var options = {
  uri: ApiUrl,
  method: 'POST',
  body:  object,
  json:true
  };

request(options, function (error, response, body) {   
  if (!error && body != null) {        
    resolve(body); 
  }
  else {
    resolve();
  }
});
    });
 }).catch(error => reject(error));
    }).catch(error => reject(error));
    }    )
    .catch(error => reject(error));
 });

}
 }

 module.exports = LicenceService;