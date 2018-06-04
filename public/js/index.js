
var socket = io();
socket.on('connect', function () {
    console.log('connected to the server');

});

socket.on('disconnect', function () {
    console.log('disconnected from the server');
});

socket.on('newMsg', function (msg) {
    console.log('newMsg: ', msg);
});

socket.on('chtMsg', function (msg) {
    console.log('chtMsg: ', msg);
});


