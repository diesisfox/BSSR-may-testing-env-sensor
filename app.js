//
//Made for May testing
//Simple application that collects data through a Serial Port and logs it in a log file
//


const fs = require('fs');
const stream = require('stream');
const Buffer = require('buffer').Buffer;
const SerialPort = require('serialport');

//specifying the COM port through command line, right after the "npm start"
const portName = process.argv[2];
const port = new SerialPort(portName,{});

//defining the log file as well as the parser
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

//creating a pipe and having listening events for the port
port.pipe(parser);

port.on('open', function(){
    console.log('Beginning Data Collection:');
});

port.on('data', function(data){
    port.write(data);
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