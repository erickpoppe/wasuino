var http = require('http'),
	dgram = require('dgram'),
	socketio = require('socket.io');
	//server = dgram.createSocket("udp4");
var fs = require('fs');

var app = http.createServer(),
    io = socketio.listen(app),
    socket = dgram.createSocket('udp4');

var crlf = new Buffer(2);
crlf[0] = 0xD; //CR - Carriage return character
crlf[1] = 0xA; //LF - Line feed character

socket.on("message", function (content, rinfo) {
	console.log("server got: " + content.readUInt16LE(0) + " from " + rinfo.address + ":" + rinfo.port); 
	fs.appendFile('mydata.txt', content.readUInt16LE(0) + crlf, encoding='utf8');//write the value to file and add CRLF for line break
	io.sockets.emit('udp message', content.toString());
});

app.listen(7000, function(){
	console.log("Listening on port 7000");
});

// server.on("message", function (msg, rinfo) { //every time new data arrives do this:
//   console.log("server got: " + msg.readUInt16LE(0) + " from " + rinfo.address + ":" + rinfo.port); // you can comment this line out
//   fs.appendFile('mydata.txt', msg.readUInt16LE(0) + crlf, encoding='utf8');//write the value to file and add CRLF for line break
// });

// server.on("listening", function () {
//   var address = server.address();
//   console.log("server listening " + address.address + ":" + address.port);
// });

socket.bind(6000); //listen to udp traffic on port 6000
