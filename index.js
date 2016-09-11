var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var axios = require('axios');

var SOCKET_LIST = {};
var PLAYER_LIST = {};

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

app.use(express.static('public'));

app.set('port', (process.env.PORT || 3000));

var Player = function(id){
  var self = {
    x:100,
    y:100,
    id:id,
    number:"" + Math.floor(10 * Math.random()),
  };
  return self;
};

io.on('connect', function(socket) {
  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;

  var player = Player(socket.id);
  PLAYER_LIST[socket.id] = player;
  console.log(socket.id + 'has connected');

  socket.emit('new player', player);

  socket.on('disconnect', function() {
    delete SOCKET_LIST[socket.id];
    delete PLAYER_LIST[socket.id];
    console.log(socket.id + ' has disconnected');
  });
});

setInterval(function(){
  var pack = [];
  for (var i in PLAYER_LIST){
    var player = PLAYER_LIST[i];
    player.x++;
    player.y++;
    pack.push({
      x: player.x,
      y: player.y,
      number: player.number
    });
  }
  for (var j in SOCKET_LIST) {
    var socket = SOCKET_LIST[j];
    socket.emit('newPositions', pack);
  }
},100);

http.listen(app.get('port'), function() {
  console.log('Express server running at localhost', app.get('port'));
});
