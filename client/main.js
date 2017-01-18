import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.cmd.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.commandInput = new ReactiveVar("> ");
  this.commandOutput = new ReactiveVar(" - ");
  
});

Template.cmd.helpers({
  commandInput() {
    return Template.instance().commandInput.get();
  },
  commandOutput() {
    return Template.instance().commandOutput.get();
  },
});

Template.cmd.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    const commandinput = $('input[name="command"] ');
    console.log("command = " + commandinput[0].value);
    instance.commandInput.set("> " + commandinput[0].value);
    Meteor.call('runCode', commandinput[0].value,  function (err, response) {
      if (err){
        console.log("cmd Error = " + err);
      } else {
        console.log("cmd Response = " + response);
        instance.commandOutput.set(response);
      }
    });
  },
});

Template.ziptest.events({
  'click button'(event, instance) {
    let zipPath = 'C:/Users/Rob/Downloads/cds-go-live.zip';
    const zipPathInput = $('input[name="zipPath"] ');
    if (zipPathInput[0].value){
      zipPath = zipPathInput[0].value.replace(/\\/gi, '/');
    }
    console.log("zipPath = " + zipPath);
    
    let outputPath = 'C:/tmp/';
    const outputPathInput = $('input[name="outputPath"] ');
    if (outputPathInput[0].value){
      outputPath = outputPathInput[0].value.replace(/\\/gi, '/');
    }
    console.log("outputPath = " + outputPath);
    
    Meteor.call('extractZip', zipPath, outputPath,  function (err, response) {
      if (err){
        console.log("zip Error = " + err);
      } else {
        console.log("zip Response = " + response);
      }
    });
  },
});

Template.ogrdbtest.events({
  'click button'(event, instance) {
    let gisPath = 'C:/Users/Rob/Documents/Gis/data/shp_sampledata/duurzaam_ondernemen_ijsselstein.shp';
    const gisPathInput = $('input[name="gisPath"] ');
    if (gisPathInput[0].value){
      gisPath = gisPathInput[0].value.replace(/\\/gi, '/');
    }
    console.log("gisPath = " + gisPath);
    
    let dbDriver = 'PostgreSQL';
    const dbDriverInput = $('input[name="dbDriver"] ');
    if (dbDriverInput[0].value){
      dbDriver = dbDriverInput[0].value.replace(/\\/gi, '/');
    }
    console.log("dbDriver = " + dbDriver);
    
    let dbConn = 'PG:"dbname=gdaltest host=192.168.99.100 port=6544 user=postgres password=postgres"';
    const dbConnInput = $('input[name="dbConn"] ');
    if (dbConnInput[0].value){
      dbConn = dbConnInput[0].value.replace(/\\/gi, '/');
    }
    console.log("dbConn = " + dbConn);
    
    Meteor.call('ogr2db', gisPath, dbDriver, dbConn, function (err, response) {
      if (err){
        console.log("ogr Error = " + err);
      } else {
        console.log("ogr Response = " + response);
      }
    });
  },
});

Template.oracletest.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.count = new ReactiveVar(0);
  
});

Template.oracletest.events({
  'click button'(event, instance) {
    let title = 'Dataset';
    const titleInput = $('input[name="title"] ');
    if (titleInput[0].value){
      title = titleInput[0].value;
    }
    console.log("title = " + title);
    
    let uuid = '{CD06BC3B-789D-4C51-AAFA-A467912B8965}';
    let physicalName = 'dataset-' + instance.count.get();
    let documentation = 'very long string';
    instance.count.set(instance.count.get() + 1);
    Meteor.call('updateOracleCollection', title, uuid, physicalName, documentation,  function (err, response) {
      
      if (err){
        console.log("oracle Error = " + err);
      } else {
        console.log("oracle Response = " + response);
      }
    });
  },
});


 