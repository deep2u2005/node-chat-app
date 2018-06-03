
var socket = io();
socket.on('connect', function () {
    console.log('connected to the server');

    socket.emit('createMsg', {
        from: 'ravi',
        msg: 'Hey, I am good, how are you?'
    });

});

socket.on('disconnect', function () {
    console.log('disconnected from the server');
});

socket.on('newMsg', function (msg) {
    console.log('newMsg: ', msg);
});



