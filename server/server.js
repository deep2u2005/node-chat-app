
// io.emit send event to everyone
// socket.broadcast.emit send event to every one except the user
// socket.emit send event to one user
// send event to every user connected to a room -> io.to('roomname').emit
// send event to every user connected to a room except the user -> socket.broadcast.to('roomname').emit

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const { generateMessage } = require('./utils/message');
const { generateLocationMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '/../public');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

var users = new Users();

var port = process.env.PORT || 3000;

var app = express();
app.use(express.static(publicPath));

var server = http.createServer(app);

var io = socketIO(server);
io.on('connection', (socket) => {
    console.log('New User Connected');

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMsg', generateMessage('Admin', `${user.name} has left the room`));
        }
    });

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) && !isRealString(params.room)) {
            return callback('Name and room name are required');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMsg', generateMessage('Admin', `Welcome to Node Chat App, Room : ${params.room}`));
        socket.broadcast.to(params.room)
            .emit('newMsg', generateMessage('Admin', `${params.name} has joined the room`));
        callback();
    });

    socket.on('createMsg', (message, callback) => {
        var user = users.getUser(socket.id);
        if (user && isRealString(message.msg)) {
            io.to(user.room).emit('newMsg', generateMessage(user.name, message.msg));
        }
        callback();
    });

    socket.on('createLocationMsg', (coords) => {
        var user = users.getUser(socket.id);
        if (user && coords) {
            io.to(user.room).emit('newLocationMsg', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });
});

server.listen(port, () => {
    console.log('Started listening on port: ', port);
});

