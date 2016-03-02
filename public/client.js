var socket = io();

var connectionCount = document.getElementById('connection-count');
var statusMessage   = document.getElementById('status-message');
var currentVote     = document.getElementById('current-vote');
var currentVoteItem = document.getElementById('vote-item');
var buttons         = document.querySelectorAll('#choices button');

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function(){
    socket.send('voteCast', this.innerText);
  });
};

socket.on('usersConnected', function (count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('statusMessage', function(message){
  statusMessage.innerText = message;
});

socket.on('voteCount', function (votes) {
  currentVote.innerText = "Your current vote is: " + current(votes)
  debugger
  currentVoteItem.innerText = "A: " + votes.A +  "  --  " +
                              "B: " + votes.B +  "  --  " +
                              "C: " + votes.C +  "  --  " +
                              "D: " + votes.D
})

function current(votes) {
  for (var vote in votes) {
    if (votes[vote] >= 1) {
      return vote
    }
  }
}
