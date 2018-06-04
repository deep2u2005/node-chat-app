
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

socket.on('newLocationMsg',function(message){
    var li = $('<li></li>');
    var a = $('<a target="_blank">My Current Location</a>');
    a.attr('href',message.url);
    li.text(`${message.from}:`);
    li.append(a);
    $('#messages').append(li);
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMsg', {
        from: 'User',
        msg: $('[name=message]').val()
    }, function () {

    });
});

var locationButton = $('#geo-location');

locationButton.on('click', function (e) {
    e.preventDefault();
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }
    navigator.geolocation.getCurrentPosition(function (position) {
       socket.emit('createLocationMsg',{
           latitude: position.coords.latitude,
           longitude: position.coords.longitude
       });
    }, function () {
        alert('Unable to fetch location.');
    });
});



