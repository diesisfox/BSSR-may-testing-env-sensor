/*
const SerialPort = require('serialport');
//specifying the COM port through command line, right after the "npm start"
const portName = process.argv[2];

const port = new SerialPort(portName,{
    baudrate: 9600,
    parser:SerialPort.parsers.readline("\n")
});
*/

const fs = ('fs');
const stream = require('stream');
const util = require('util');

const log_file = fs.createWriteStream(__dirname + '/dataTEST.log', {flags : 'w'});
const Transform = stream.Transform;
const parser = new Transform();

parser._transform = function(data, encoding, done){
    const timeStamp = Date.now();
    log_file.write(timeStamp.toString() + util.format(data) + '\n');
    parser.pipe(log_file);
    done();
};

//pipes standard input from terminal to the log file
process.stdin
    .pipe(parser);

//in the case of error
process.stdout.on('error', process.exit);