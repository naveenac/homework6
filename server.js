var express = require('express');
var app = express();
var mongoose = require('mongoose');
var server = require('http').createServer(app);
var uri =  'mongodb://jyoon:helloavery@ds139267.mlab.com:39267/cpsc473'
mongoose.connect(uri);

// Create schema for questions
var QuestionSchema = mongoose.Schema({
    'question': String, 
    'answerID': String
});
var Question = mongoose.model('Question', QuestionSchema);

var io = require('socket.io').listen(server);
users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running on port 3000');

app.get('/', function (req ,res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);
    
    //Disconnect
    socket.on('disconnect', function (data) {
       users.splice(users.indexOf(socket.username),1);
       updateUsernames(); connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });
    
    // Send Message
    socket.on('send message', function(data){
        //console.log(data);
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });
    
    //New user
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username=data;
        users.push(socket.username);
        updateUsernames();
    });
    
    function updateUsernames(){
        io.sockets.emit('get users', users);
    }
    
});



