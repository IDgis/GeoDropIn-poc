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


 