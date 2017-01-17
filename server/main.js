import { Meteor } from 'meteor/meteor';

'use strict';


var Future;
var exec;
var fs;
var unzip;

Meteor.startup(function () {
  // Load future from fibers
  Future = Npm.require("fibers/future");
  console.log('Future: ' + Future);
  // Load exec
  exec = Npm.require("child_process").exec;
  console.log('exec: ' + exec);
  
  unzip = Npm.require('unzip');
  console.log('unzip: ' + unzip);
  
  fs = Npm.require('fs');
  console.log('fs: ' + fs);
});

// Server methods
Meteor.methods({
  runCode: function (command) {
    // This method call won't return immediately, it will wait for the
    // asynchronous code to finish, so we call unblock to allow this client
    // to queue other method calls (see Meteor docs)
    this.unblock();
    var future=new Future();
    console.log("command: " + command);
    console.log('exec: ' + exec);
    exec(command,function(error,stdout,stderr){
      if(error){
        console.log("Error = " + error);
        future.return(stderr.toString());
      } else {
        future.return(stdout.toString());
      }
    });
    return future.wait();
  }, 
  
  extractZip: function (zipPath, outputPath){
    console.log('fs: ' + fs);
    console.log('unzip: ' + unzip);
    try {
      fs.createReadStream(zipPath).pipe(unzip.Extract({ path: outputPath }));
      return 'OK';
    } catch (e){
      console.log('error: ', e);
      return e;
    }
  }
});
 