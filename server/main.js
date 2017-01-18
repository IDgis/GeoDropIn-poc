import { Meteor } from 'meteor/meteor';
'use strict';


var Future;
var exec;
var fs;
var unzip;
var ogr2ogr;
var metadataColl;

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

  ogr2ogr = Npm.require('ogr2ogr')
  console.log('ogr2ogr: ' + ogr2ogr);

//  Oracle.setDefaultOracleOptions(
//      {connection: {
//          user: "meteor", 
//          password: "meteor", 
//          connectString: "192.168.99.100:49161/xe"
//          }
//      });
  
  metadataColl = new Mongo.Collection("SDE.GDB_ITEMS_VW");

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
    console.log('zipPath: ' + zipPath);
    console.log('outputPath: ' + outputPath);
    try {
      fs.createReadStream(zipPath).pipe(unzip.Extract({ path: outputPath }));
      return 'OK';
    } catch (e){
      console.log('error: ', e);
      return e;
    }
  },
  
  ogr2db: function (gisPath, dbDriver, dbConn){
    console.log('gisPath: ' + gisPath);
    console.log('dbDriver: ' + dbDriver);
    console.log('dbConn: ' + dbConn);
    try {
      let result = ogr2ogr(gisPath)
      .format(dbDriver)
      .skipfailures()
      .destination(dbConn)
      .exec(function(er, buf) {
        if (er){
          console.log('error: ', er);
        }
      });
      return result;
    } catch (e){
        console.log('error: ', e);
      return e;
    }
  },
  
  updateOracleCollection: function (theTitle, theUuid, thePhysicalName, theDocumentation){
    console.log('title: ' + theTitle);
    console.log('uuid: ' + theUuid);
    let dataType = '{CD06BC3B-789D-4C51-AAFA-A467912B8965}';
    console.log('dataType: ' + dataType);
    console.log('physicalName: ' + thePhysicalName);
    console.log('documentation: ' + theDocumentation);


    metadataColl.insert({uuid: theUuid, type: dataType, physicalname: thePhysicalName, documentation: theDocumentation, title: theTitle});

    let rows = metadataColl.find({type: '{CD06BC3B-789D-4C51-AAFA-A467912B8965}'}).fetch();

    console.log('rows: ', rows);
  },

});
 