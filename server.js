const http = require('http');
const express = require('express');

const app = express();
const socketIo = require('socket.io');

app.use(express.static('public'));

app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/index.html');
});

const port = process.env.PORT || 3000;

const server = http.createServer(app)

server.listen(port, function () {
                    console.log('Listening on port ' + port + '.');
                  });


const io = socketIo(server);


io.on('connection', function (socket) {
  console.log('A user has connected! There are ' + io.engine.clientsCount + ' clients');

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  socket.on('disconnect', function(){
    console.log('A user has dis-connected! There are ' + io.engine.clientsCount + ' clients');
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });

  socket.on('message', function (channel, message) {
    console.log(channel, message);
  });
});


module.exports = server;

