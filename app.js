//
//Made for May testing
//Simple application that collects data through a Serial Port and logs it in a log file
//
//
const SerialPort = require('serialport');
//specifying the COM port through command line, right after the "npm start"
const portName = process.argv[2];

require('console-stamp')(console, { pattern: 'HH:MM:ss.l' });
//need this install 

const port = new SerialPort(portName,{
    parser:serialport.parsers.readline("\r\n")

    //we dont need to change the baud rate
});

port.on('open', onOpen);
port.on('data', onData);


function onOpen(){
    console.log("Begin Data Collection"); 
}

function onData(data){
    console.log("on Data " + data);
}


const fs = require('fs');
const stream = require('stream');
const Buffer = require('buffer').Buffer;
const Transform = stream.Transform;

const parser = new Transform();
const log_file = fs.createWriteStream(__dirname + '/dataTEST.log', {flags : 'w'});

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

/*
//pipes standard input from terminal to the log file
process.stdin
    .pipe(parser);

//in the case of error
process.stdout.on('error', process.exit);
*/
