import express from 'express';
import child_process from 'child_process';
import redis from 'redis';
import path from 'path';
var url = require('url');
var fs = require('fs');
var crypto = require('crypto');
//npm install request
var request = require('request');

var app=express();
var rclient = redis.createClient();
// Replace "###...###" below with your project's host, access_key and access_secret.
var defaultOptions = {
  host: 'identify-us-west-2.acrcloud.com	',
  endpoint: '/v1/identify',
  signature_version: '1',
  data_type:'audio',
  secure: true,
  access_key: '4878b111af4f44f7bbd1cbcb9ce0f835',
  access_secret: 'xhBw6gKWuLqSd0jB4FbVYF4SXAEtZ3NFqH3j6lBK'
};

function buildStringToSign(method, uri, accessKey, dataType, signatureVersion, timestamp) {
  return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n');
}

function sign(signString, accessSecret) {
  return crypto.createHmac('sha1', accessSecret)
    .update(new Buffer(signString, 'utf-8'))
    .digest().toString('base64');
}

/**
 * Identifies a sample of bytes
 */
function identify(data, options, cb) {

  var current_data = new Date();
  var timestamp = current_data.getTime()/1000;

  var stringToSign = buildStringToSign('POST',
    options.endpoint,
    options.access_key,
    options.data_type,
    options.signature_version,
    timestamp);

  var signature = sign(stringToSign, options.access_secret);

  var formData = {
    sample: data,
    access_key:options.access_key,
    data_type:options.data_type,
    signature_version:options.signature_version,
    signature:signature,
    sample_bytes:data.length,
    timestamp:timestamp,
  }
  request.post({
    url: "http://"+options.host + options.endpoint,
    method: 'POST',
    formData: formData
  }, cb);
}

console.log(fs.existsSync('/run/media/sathiya/Data/Songs/001new songs/001mariyan/Sonapareeya .mp3'));
/*child_process.exec('/home/sathiya/exes/acrcloud_extr_linux -cli -i "/run/media/sathiya/Data/Songs/001new songs/001mariyan/Sonapareeya .mp3" -o "/home/sathiya/file.mp3"',(error,data)=>{
    if(error)
    console.log("error",error)
    console.log("data",data)
});*/

app.get("/",(req,res)=>{
  res.send("Hello World");
})

var sourcedir='/run/media/sathiya/Data/Songs'
var destdir='/home/sathiya/songs'

const direntries=(dir,destdir)=>{//console.log(dir); 
  if(!fs.existsSync(destdir))
  fs.mkdirSync(destdir)
  fs.readdir(dir,{withFileTypes:true},(error,files)=>{
      //console.log(files)
      files.forEach((file)=>{
        if(file.isDirectory()){
          //console.log(file.name);
          //console.log(path.join(dir,file.name))
          setTimeout(()=>direntries(path.join(dir,file.name),path.join(destdir,file.name)),1);
        }else if(file.isFile()){
          //console.log(path.extname(file.name))
          if(path.extname(file.name).toLowerCase()==='.mp3')
          {
            console.log(path.join(dir,file.name),'=>',path.join(destdir,file.name))
            child_process.exec('/home/sathiya/exes/acrcloud_extr_linux -cli -i "'+path.join(dir,file.name)+'" -o "'+path.join(destdir,file.name+'.cli"'),(error,data)=>{
              if(error)
              console.log("error",error)
              //console.log("data",data)
          });
          rclient.hmset(file.name+".cli","sourcefile",path.join(dir,file.name))
          }//console.log(file.name)          
        }
      })  
      });
}
direntries(sourcedir,destdir)
rclient.unref();
app.listen(3000);
//var bitmap = fs.readFileSync('sample.wav');

/*identify(new Buffer(bitmap), defaultOptions, function (err, httpResponse, body) {
  if (err) console.log(err);
  console.log(body);
});*/