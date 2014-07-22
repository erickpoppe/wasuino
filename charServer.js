var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dgram = require('dgram');
var server = dgram.createSocket("udp4");

app.use('/bower_components',  express.static(__dirname + '/bower_components'));

server.on("message", function (msg, rinfo) { //every time new data arrives do this:)
  console.log("server got: " + msg.readUInt16LE(0) + " from " + rinfo.address + ":" + rinfo.port);
  io.emit('chat message', msg.readUInt16LE(0));
});

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " + address.address + ":" + address.port);
});

server.bind(6000); //listen to udp traffic on port 6000

app.get('/', function(req, res){
  res.sendfile('public/index2.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});