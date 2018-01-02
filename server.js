var express = require("express");
 var app = express(),
    bodyParser = require('body-parser'),
    db = require('./lectus-api-master/config/db'),
     serveStatic = require("serve-static"),
     fs = require('fs'),
     joinPath = require('path.join'),
     process = require('process');
const detect = require('detect-port');
    var multer = require('multer');
    var SecretManager = require('./SecretManagement');

    SecretManager.tryLoadSecrets();

var storage = multer.diskStorage({
    destination: function (req, file, callback) {      
                     db.settings.findOne({folderName: "temp"}, (err, settings) => {
                if (err) {                    
                } else if (!settings) {
                   
                } else {
                callback(null, joinPath(settings.folderPath, '/')); 
              }
            });         
       
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});


var upload = multer({ storage: storage });

app.use(express.static(joinPath(__dirname , 'dist'))); 
 
app.use(bodyParser.json());
var cors = require('./lectus-api-master/middleware/cors');
var token = require('./lectus-api-master/middleware/verify-token');
var admin = require('./lectus-api-master/middleware/admins-only');
var controller =require('./lectus-api-master/controllers');
var error = require('./lectus-api-master/middleware/error-handler');

app.use(cors);
app.use('/api', token);
app.use('/api/admin',admin);
app.use(controller);
app.use(error);

var authorizationServiceApi = require("./AuthorizationServiceApi");
app.use("/authorization", authorizationServiceApi.createRouter());

app.get('/restart', function (req, res, next) {
var fs = require('fs');
fs.writeFile("./test", "Hey there!", function(err) {
    if(err) {
        return console.log(err);
    }

}); 
});
 
// app.get('/restart', function (req, res, next) {
//  var app2 = express();
//     app2.use('/dir3', express.static('D:\\Letcus-Client\\5April\\lectus\\dist\\public\\')); 
// app2.listen(4000);
// // // Optional part (if there's an running webserver which blocks a port required for next startup
// // try {
// //   app.webserver.close(); // Express.js instance
// //   console.log("Webserver was halted", 'success');
// // } catch (e) {
// //  console.log("Cant't stop webserver:", 'error'); // No server started
// //   }

// // // First I create an exec command which is executed before current process is killed
// // var sExecute = "node server";
// // var pid = process.pid;

// // // Then I look if there's already something ele killing the process  
// // if (express.killed === undefined) {
// //   express.killed = true;

// //   // Then I excute the command and kill the app if starting was successful
// //   var exec = require('child_process').exec;
// //   exec(sExecute, function () {
// //     console.log('APPLICATION RESTARTED', 'success');
// //    process.kill(pid);
// //   });
// // }

//  res.json({ success: true});
// });

app.post('/profile/photo', upload.single('userPhoto'), function (req, res, next) {
    // req.file is the `avatar` file 
    // req.body will hold the text fields, if there were any 
       // read binary data
    var bitmap = fs.readFileSync(req.file.path);
    // convert binary data to base64 encoded string
var filedata = new Buffer(bitmap).toString('base64');
    res.json({ success: true, filepath: req.file.path, filedata: filedata });
});

// app.get('/', function (req,res) {
//     res.send('Hello word');
// });

// tcpPortUsed.check(80, '127.0.0.1')
// .then(function(inUse) {
//    if (inUse){
//          console.error('Port 80 is used already used in other process, please stop it first ');
//    }
//    else {
var  port=80;
     
detect(port, (err, _port) => {
    
  if (err) {
    console.log(err);
  }

  setTimeout(function(){   

  if (port === _port) {
      
        if (db.settings != undefined)
    {   
 db.settings.findOne({folderName: "movies"}, (err, settings) => {
     
                   if (err) {  
                                  
                } else if (settings == null) {
                     
       app.listen(port);
console.log('Running on port '+ port);
                } else {     
                     db.settings.findOne({folderName: "tvshows"}, (err, settings) => {
  app.use('/dir3', express.static(''+settings.folderPath+''));   
                     });
                                   app.use('/dir', express.static(''+settings.folderPath+''));                    
                     db.settings.findOne({folderName: "default"}, (err, settings) => {
                if (err) {                    
                } else if (settings==null) {
                   
                } else {                                                                             
                  app.use('/dir2', express.static(''+settings.folderPath+''));             
       app.listen(port);
console.log('Running on port '+ port);
                }
            });  
                }
            });
    }
else {
  app.listen(port);
console.log('Running on port '+ port);
}
  } else {
    console.error('Port '+ port +' is used already used in other process, please stop it first ');
  }
    }, 2000);
});
   
//    }
// }, function(err) {
//     console.error('Error on check:', err.message);
// });

 /* serves main page */
//  app.get("/", function(req, res) {
//     res.sendfile('./dist/index.html')
//  });

//  var port = process.env.PORT || 3000;
 
//  app.listen(port, function() {
//    console.log("Listening on " + port);
//  });