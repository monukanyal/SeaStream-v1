var express = require('express');
var secretManagement = require('./SecretManagement');
var moment = require("moment");
var uuid = require('node-uuid');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
db = require('./lectus-api-master/config/db'),

module.exports = {
  "createRouter": function (){
    var router = express.Router();

    router.get("/:videoName", function(request, response){
    
      db.movies.find({ title: request.params.videoName }, function(error, video){
    
        if (error || !video){
          response.status(400).send("No such video");
          return;
        }

        if(video.licenseToken){
          response.json(video.licenseToken);
          return;
        }

       

        if(!secretManagement.areSecretsAvailable()){
          response.status(500).send("You must configure the secrets file to generate license tokens");
          return;
        }

        video.keys = [{
            "keyId": "08cfb756-29d9-44ee-a370-42dbd80684fd",
            "key": "IwbzbXIGRMxM+K89ZlAB7g=="
        }];

        var secrets = secretManagement.getSecrets();
        var communicationKeyAsBuffer = Buffer.from(secrets.communicationKey, "hex");

        var now = moment();
        var validFrom = now.clone().subtract(1, "days");
        var validTo = now.clone().add(1, "days");

        var message = {
          "type" : "entitlement_message",
          "begin_date": validFrom.toISOString(),
          "expiration_date" : validTo.toISOString(),
          "keys": []
        };

        video.keys.forEach(function(key){
          var contentKeyAsBuffer = Buffer.from(key.key, "base64");

          var keyIdAsBuffer = Buffer.from(uuid.parse(key.keyId));


          var encryptor = crypto.createCipheriv("aes-256-cbc", communicationKeyAsBuffer, keyIdAsBuffer);

          encryptor.setAutoPadding(false);

          var encryptedKeyAsBuffer = encryptor.update(contentKeyAsBuffer);
          encryptedKeyAsBuffer = Buffer.concat([encryptedKeyAsBuffer, encryptor.final()]);

          message.keys.push({
            "id" : key.keyId,
            "encrypted_key": encryptedKeyAsBuffer.toString("base64")
          });
        });

        var envelope = {
          "version": 1,
          "com_key_id": secrets.communicationKeyId,
          "message": message,
          "begin_date": validFrom.toISOString(),
          "expiration_date": validTo.toISOString(),
        };

       
        var licenseToken = jwt.sign(envelope, communicationKeyAsBuffer, {
          "algorithm": "HS256"
        });

        response.json(licenseToken);


      });

      // var video = {
      //   "name": "Axinom demo video",
      //   "url": "https://media.axprod.net/TestVectors/v6-MultiDRM/Manifest_1080p.mpd",
      //   // This video has a hardcoded license token, for maximum ease of use of the sample app.
      //   // Never do this in production - always generate a new license token on every request.
      //   // "licenseToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoxLCJjb21fa2V5X2lkIjoiNjllNTQwODgtZTllMC00NTMwLThjMWEtMWViNmRjZDBkMTRlIiwibWVzc2FnZSI6eyJ0eXBlIjoiZW50aXRsZW1lbnRfbWVzc2FnZSIsImtleXMiOlt7ImlkIjoiNmU1YTFkMjYtMjc1Ny00N2Q3LTgwNDYtZWFhNWQxZDM0YjVhIn1dfX0.yF7PflOPv9qHnu3ZWJNZ12jgkqTabmwXbDWk_47tLNE",
      //   "keys": [
      //     {
      //       "keyId": "6e5a1d26-2757-47d7-8046-eaa5d1d34b5a",
      //       "key": "GX8m9XLIZNIzizrl0RTqnA=="
      //     }
      //   ],
      //   "title": "John Wick",
      //   "description": "After the sudden death of his beloved wife, John Wick receives one last gift from her, a beagle puppy named Daisy, and a note imploring him not to forget how to love. But John's mourning is interrupted when his 1969 Boss Mustang catches the eye of sadistic thug Iosef Tarasov who breaks into his house and steals it, beating John unconscious in the process. Unwittingly, he has just reawakened one of the most brutal assassins the underworld has ever known.",
      //   "released": "2014",
      //   "poster_path": "posters/John Wick.jpg",
      //   "backdrop_path": "backdrops/John Wick.jpg",
      //   "genre": "Action",
      //   "run_time": 101,
      //   "cast": [
      //     "Keanu Reeves",
      //     "Michael Nygvist",
      //     "Alfie Allen",
      //     "Willem Dafoe"
      //   ]
      // };

      // if(!video){
      //   response.status(400).send("No such video");
      //   return;
      // }


    });

    return router;
  }
};
