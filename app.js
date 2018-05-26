//
//Made for May testing
//Simple application that collects data through a Serial Port and logs it in a log file
//

//requiring all the modules required
const fs = require('fs');
const util = require('util'); 
const stream = require('stream');
const Buffer = require('buffer').Buffer;
const SerialPort = require('serialport');
require('console-stamp')(console, { pattern: 'HH:MM:ss.l' }); 
const readline = require ('readline');  


//specifying the port address and then the sensorName(for the sake of logging files), right after the "npm start"
const portName = process.argv[2];
const sensorName = process.argv[3];

//this is required for logging files on console
const port = new SerialPort(portName,{
    parser:SerialPort.parsers.readline("\r\n") 
});

var externalFile; 
 
//looking for existing log file directory 
//if not found, making a new directory with date and time in the name 
fs.stat(`./logs`, function(err,stat){ 
  if(stat && stat.isDirectory()){ 
    externalFile = fs.createWriteStream(`./logs/${dateformat(new Date(),'mmddyyyy-HHMMss')}.log`); 
  }else{ 
    fs.mkdir('./logs',function(e){ 
      if(e) log(e); 
      externalFile = fs.createWriteStream(`./logs/${dateformat(new Date(),'mmddyyyy-HHMMss')}.log`); 
    }) 
  } 
}) 

//specifying what happens when the port opens. Creating the file to log in automatically
port.on('open', function(){
    console.log('Beginning Data Collection:');

    //Making a new directory with date and time in the name
    fs.stat(`./logs`, function(err,stat){
        if(stat && stat.isDirectory()){
            externalFile = fs.createWriteStream(__dirname + Date.now().toString() + '.log');
        }else{
            fs.mkdir('./logs',function(e){
                if(e) log(e);
                externalFile = fs.createWriteStream(__dirname + Date.now().toString() + '.log');
            })
        }
    });
});

 
 
 
 
 
/*no need for all this 
//defining the log file as well as the parser
const Transform = stream.Transform;
const parser = new Transform();

const log_file = fs.createWriteStream(__dirname + fileName, {flags : 'w'}); //creating the directory to create the file in

parser._transform = function(data, encoding, done){
    const timeStamp = new Date();
    const month = timeStamp.getMonth() + 1; //because the month logs from 0-11
    //converting the data from bugger to integers
    const IntData = Buffer.from(data, 'utf8');

    log_file.write(
        '{ TimeStamp [' + timeStamp.getFullYear() + ':' + month + ':' + timeStamp.getDate()+ '][' + timeStamp.getHours() +' h: ' + timeStamp.getMinutes() + ' min: ' + timeStamp.getSeconds() + ' s: ' + timeStamp.getMilliseconds() + ' ms]\n' +
        ' Data:' + IntData + ' },\n'
    );
    done();
};

//creating a pipe and having listening events from the port. Connects all the pipes
port.pipe(parser);
parser.pipe(log_file);

///How the port behaves upon receiving each data packet
port.on('data', function(data){
    //upon receiving data, port writes data to parser, which writes to log_file
    port.write(data); //not sure if port.write actually writes to the parser any ideas?
    console.log(data);
});


/* THINGS TO WORK ON:
    -flush to save to memory, not saving. But if a new file is created each time, it might help
    -create menu to navigate to the desired port, because finding ports on Linux is a pain in the ass
*/