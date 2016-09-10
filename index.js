var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var axios = require('axios');

var people = {};

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

app.use(express.static('public'));

io.on('connect', function(socket) {
  console.log('a user connected');

  socket.on('movement_x_from_client', function(data){
    io.emit("movement_x_from_server", data);
  });

  socket.on('movement_y_from_client', function(data){
    io.emit("movement_y_from_server", data);
  });

  socket.on('disconnect', function() {
    console.log(people[socket.id] + ' has disconnected');
    io.emit('update', people[socket.id] +  'has left the room');
    delete people[socket.id];
    io.emit("update-people", people);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
