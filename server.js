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


var votes = {};

io.on('connection', function (socket) {
  console.log('A user has connected! There are ' + io.engine.clientsCount + ' clients');

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      socket.emit('voteCount', countVotes(votes));
    }
  });

  socket.on('disconnect', function(){
    console.log('A user has dis-connected! There are ' + io.engine.clientsCount + ' clients');
    delete votes[socket.id];
    socket.emit('voteCount', countVotes(votes))
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });
});

function countVotes(votes) {
  var voteCount = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
  };
  for (var vote in votes) {
    voteCount[votes[vote]] ++
  }
  return voteCount;
}

module.exports = server;

