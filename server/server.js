const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const { generateMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '/../public');

var port = process.env.PORT || 3000;

var app = express();
app.use(express.static(publicPath));

var server = http.createServer(app);

var io = socketIO(server);
io.on('connection', (socket) => {
    console.log('New User Connected');

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });

    socket.emit('newMsg', generateMessage('Admin', 'Welcome to Node Chat App'));

    socket.broadcast.emit('newMsg', generateMessage('Admin', 'New user joined'));

    socket.on('createMsg', (message, callback) => {
        console.log('createMsg', message);
        io.emit('newMsg', generateMessage(message.from, message.msg));
        callback('This is from the server!');
        // socket.broadcast.emit('newMsg', {
        //     from: message.from,
        //     msg: message.msg
        // });
    });
});

server.listen(port, () => {
    console.log('Started listening on port: ', port);
});

