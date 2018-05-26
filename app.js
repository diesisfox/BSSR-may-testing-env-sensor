//
//Made for May testing
//Simple application that collects data through a Serial Port and logs it in a log file
//

//Requiring necessary modules
const fs = require('fs');
const SerialPort = require('serialport');
require('console-stamp')(console, { pattern: 'HH:MM:ss.l' });
const readline = require ('readline');
const path = require('path');

/*
const util = require('util');
const stream = require('stream');
const Buffer = require('buffer').Buffer;
*/

//creates directory for data collection
console.log("Searching for existing directories . . .\n");

fs.stat(`./Race_Data_Logs`, function(err,stat){
    if(stat && stat.isDirectory()){
        console.log("Directory already exists, creating new log file\n");
    }else{
        console.log("No directory found, creating new directory\n");
        fs.mkdir('./Race_Data_Logs',function(){
            console.log("Creating log file in Race_Data_Logs directory\n");
        })
    }
});

//creates log files in the directory
const creationDate = new Date();
const externalFileName = 'month' + (creationDate.getMonth()+1).toString() + '-day' + creationDate.getDate() + '-hr' + creationDate.getHours() + '-min' + creationDate.getMinutes() + '-sec' + creationDate.getSeconds() + '-ms' + creationDate.getMilliseconds() + '.log';
const logStream = fs.createWriteStream('./Race_Data_Logs/log-' + externalFileName);

//creating port selection and piping data to console and data files
let radioPort;

//enabling reading streams
const stdio = readline.createInterface({
    input: process.stdin, //reading location
    output: process.stdout //writing location
});

//Listing serial ports to the terminal and allowing for selection
SerialPort.list(function(err, connectedPorts){
    if (connectedPorts.length){
        radioPort = connectedPorts; //for use outside this block
        console.log("Following ports are connected to this device\n\nSelect a port to continue:\n");

        for (let i = 0; i < connectedPorts.length; i++){
            console.log("(" + i + ") " + connectedPorts[i].comName + " Manufactured By: " + connectedPorts[i].manufacturer + "\n");
        }
        choosePort();
    } else {
        console.log("There are no ports connected to your device. Check if ports are properly connected and try again.\n")
    }
});

function choosePort(){
    stdio.question('> ', function(res){ //response from user
        res = parseInt(res);
        if(Number.isNaN(res) || res >= radioPort.length || res<0){
            console.log("ERROR: An error occurred while connecting to the port you selected. Please check connection. Trying to reconnect . . .\n");
            choosePort();
        }else{
            console.log("Port selection valid. Connection successful.\n");

            radioPort = new SerialPort(radioPort[res].comName,{
                baudRate:9600
            });

            console.log("Port baud rate set to 9600.\n");

            //reading from the port
            radioPort.on('open', function(){
                console.log("Reading data from port . . .\n");
            });

            radioPort.on('data', function(data){
                //log to console
                console.log(data.toString());

                const timeStamp = new Date();
                const month = timeStamp.getMonth() + 1; //because the month logs from 0-11

                logStream.write(
                    '{ TimeStamp [' + timeStamp.getFullYear() + ':' + month + ':' + timeStamp.getDate()+ '][' + timeStamp.getHours() +' h: ' + timeStamp.getMinutes() + ' min: ' + timeStamp.getSeconds() + ' s: ' + timeStamp.getMilliseconds() + ' ms]\n' +
                    ' Data:' + data.toString() + ' },\n'
                );
            });
        }
    });
}