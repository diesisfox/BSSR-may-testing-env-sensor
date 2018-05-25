//
//Made for May testing (Async Version: (3) File Creation Date Format Fixed)
//Simple application that collects data through a Serial Port and logs it in a log file
//
//

const fs = require('fs');
const util = require('util'); 
const stream = require('stream');
const Buffer = require('buffer').Buffer;
const SerialPort = require('serialport');
require('console-stamp')(console, { pattern: 'HH:MM:ss.l' }); 
const readline = require ('readline');  
const path = require('path');


//specifying the port address and then the sensorName(for the sake of logging files), right after the "npm start"
const portName = process.argv[2];
const sensorName = process.argv[3];

//this is required for logging files on console
// const port = new SerialPort(portName,{
//     parser:SerialPort.parsers.readline("\r\n") 
// });

var externalFile; //will store details about the output file
var creationDate = new Date();
var radioPort;

console.log("Searching for existing directories . . .\n");

//looking for existing log file directory 
//if not found, making a new directory with date and time in the name 
fs.stat(`./logs`, function(err,stat){ 
  if(stat && stat.isDirectory()){ 
    console.log("Directory Found\n");
    console.log("Creating new .log file . . . \n");
    externalFile = path.resolve(__dirname, './logs/' + creationDate.getFullYear() + (creationDate.getMonth()+1) + creationDate.getDate() + '-hr:' + creationDate.getHours() + 'min:' + creationDate.getMinutes() + 'sec:' + creationDate.getSeconds() + 'ms:' + creationDate.getMilliseconds() + '.log'); 
    
    console.log("File created\n");
    
  }else{ 
    console.log("No directory found\n");
    console.log("Creating a new directory . . .\n");
    fs.mkdir('./logs',function(e){ 
      if(e) log(e); 
      console.log("Creating .log file . . .\n");
      externalFile = path.resolve(__dirname, './logs/' + creationDate.getFullYear() + (creationDate.getMonth()+1) + creationDate.getDate() + '-hr:' + creationDate.getHours() + 'min:' + creationDate.getMinutes() + 'sec:' + creationDate.getSeconds() + 'ms:' + creationDate.getMilliseconds() + '.log'); 
    
      console.log("File created\n"); 
    }) 
  } 
}) 

//listing all the serial ports connected to the device
SerialPort.list(function(err, connectedPorts){
    if (connectedPorts.length){
        radioPort = connectedPorts; //for use outside this block
        console.log("Following ports are connected to this device\n\nSelect a port to continue:\n");
        var i = 0;

        for (i = 0; i < connectedPorts.length; i++){
            console.log("(" + i + ") " + connectedPorts[i].comName + " Manufactured By: " + connectedPorts[i].manufacturer + "\n");
        }
        choosePort();
    } else {
        console.log("There are no ports connected to your device. Check if ports are properly connected and try again.\n")
    }
})

//enabling reading streams
const stdio = readline.createInterface({
	input: process.stdin, //reading location
	output: process.stdout //writing location
});

function choosePort(){
	stdio.question('> ', function(res){ //response from user
		res = parseInt(res);
		if(Number.isNaN(res) || res >= radioPort.length || res<0){
			console.log("ERROR: An error occured while connecting to the port you selected. Please check connection. Trying to reconnect . . .\n");
			choosePort();
		}else{
            console.log("Port selection valid. Connection successful.\n");
			radioPort = new SerialPort(radioPort[res].comName,{
				baudRate:9600 // NO 115200 
            });
            console.log("Port baudrate set to 9600.\n");

            
            //starting reading from the port
            radioPort.on('open', function(){
                console.log("Reading data from port . . .\n");
            });

            radioPort.on('data', function(data){
                console.log(data.toString());
            });

		}
	});
}


//REMAINING TASKS:
//GETTING LOGGING ON FILE REMAINS
//UPDATING IF-ELSE
////////////////////////////////////////////////////////////////////////////////////////

// //specifying what happens when the port opens. Creating the file to log in automatically
// port.on('open', function(){
//     console.log('Beginning Data Collection:');
//     const fileName = Date().now.toString() + sensorName.toString();
//     fs.writeFile(__dirname + fileName);
// });

 
 
 
 
 
/*no need for all this 
//defining the log file as well as the parser
const Transform = stream.Transform;
const parser = new Transform();
const log_file = fs.createWriteStream(__dirname + fileName, {flags : 'w'});

parser._transform = function(data, encoding, done){
    const timeStamp = new Date();
    const month = timeStamp.getMonth() + 1; //because the month logs from 0-11

    const IntData = Buffer.from(data, 'utf8');

    log_file.write(
        '{ TimeStamp [' + timeStamp.getFullYear() + ':' + month + ':' + timeStamp.getDate()+ '][' + timeStamp.getHours() +' h: ' + timeStamp.getMinutes() + ' min: ' + timeStamp.getSeconds() + ' s: ' + timeStamp.getMilliseconds() + ' ms]\n' +
        ' Data:' + IntData + ' },\n'
    );
    parser.pipe(log_file);
    done();
};

//creating a pipe and having listening events from the port
port.pipe(parser);

port.on('data', function(data){
    port.write(data);
    console.log(data);
});

/*
//pipes standard input from terminal to the log file
process.stdin
    .pipe(parser);

//in the case of error
process.stdout.on('error', process.exit);
*/

//flush to save to memory
//fix the problem with pipe
//create menu to navigate to the desired port
//auto generate files based off of time, date, and user entry
