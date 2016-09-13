var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var axios = require('axios');

var SOCKET_LIST = {};

// app.get('/', function(req, res) {
//   res.sendfile('index.html');
// });

app.use(express.static('public'));

app.set('port', (process.env.PORT || 3000));

var SOCKET_LIST = {};
var PLAYER_LIST = {};

io.on('connection', function(socket){
    console.log('a user is connected' + socket.id);
    SOCKET_LIST[socket.id] = socket;

    var player = Player(socket.id);
    PLAYER_LIST[socket.id] = player;

    socket.on('disconnect',function(){
      console.log('a user disconnected');
      io.emit('delete player', socket.id);
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });

    socket.on('keyPress',function(data){
        if(data.inputId === 'left')
            player.pressingLeft = data.state;
        else if(data.inputId === 'right')
            player.pressingRight = data.state;
        else if(data.inputId === 'up')
            player.pressingUp = data.state;
        else if(data.inputId === 'down')
            player.pressingDown = data.state;
    });
});

var Player = function(id){
    var self = {
        x:250,
        y:300,
        width: 21,
        height: 32,
        id:id,
        number:"" + Math.floor(10 * Math.random()),
        pressingRight:false,
        pressingLeft:false,
        pressingUp:false,
        pressingDown:false,
        maxSpd:5,
    };
    self.updatePosition = function(){
        container = {x: 28, y: 10, width: 488, height: 480};
        if(self.pressingRight)
            self.x += self.maxSpd;
        if(self.pressingLeft)
            self.x -= self.maxSpd;
        if(self.pressingUp)
            self.y -= self.maxSpd;
        if(self.pressingDown)
            self.y += self.maxSpd;
        if (self.x < container.x)
            self.x = container.x;
        if (self.y < container.y)
          self.y = container.y;
        if (self.x + self.width > container.width)
          self.x = container.width - self.width;
        if (self.y + self.height > container.height)
          self.y = container.height - self.height;
    };
    return self;

};


setInterval(function(){
    var pack = [];
    for(var i in PLAYER_LIST){
        var player = PLAYER_LIST[i];
        player.updatePosition();
        pack.push({
            x:player.x,
            y:player.y,
            id:player.id,
        });
    }
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('newPositions',pack);
    }
},1000/25);

http.listen(app.get('port'), function() {
  console.log('Express server running at localhost', app.get('port'));
});
