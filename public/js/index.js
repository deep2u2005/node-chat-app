
var socket = io();
socket.on('connect', function () {
    console.log('connected to the server');

});

socket.on('disconnect', function () {
    console.log('disconnected from the server');
});

socket.on('newMsg', function (message) {
    console.log('newMsg: ', message);
    var li = $('<li></li>');
    li.text(`${message.from}: ${message.msg}`);
    $('#messages').append(li);
});

socket.on('chtMsg', function (msg) {
    console.log('chtMsg: ', msg);
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMsg', {
        from: 'User',
        msg: $('[name=message]').val()
    }, function () {

    });
});