
var socket = io();

function scrollToBottom() {
    // selectors 
    var messages = $('#messages');
    var newMSG = messages.children('li:last-child');

    // heights
    var clientHeight = messages.prop('clientHeight');
    console.log('clientHeight:', clientHeight);
    var scrollTop = messages.prop('scrollTop');
    console.log('scrollTop:', scrollTop);
    var scrollHeight = messages.prop('scrollHeight');
    console.log('scrollHeight:', scrollHeight);
    var newMSGHeight = newMSG.innerHeight();
    console.log('newMSGHeight:', newMSGHeight);
    var lastMSGHeight = newMSG.prev().innerHeight();
    console.log('lastMSGHeight:', lastMSGHeight);

    //if (clientHeight + scrollTop + newMSGHeight + lastMSGHeight >= scrollHeight) 
    if (scrollHeight-clientHeight >= 16){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    console.log('connected to the server');

});

socket.on('disconnect', function () {
    console.log('disconnected from the server');
});

socket.on('newMsg', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm:ss a');
    var template = $('#msgTemplate').html();
    var html = Mustache.render(template, {
        from: message.from,
        msg: message.msg,
        createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();

    // var formattedTime = moment(message.createdAt).format('h:mm:ss a');
    // console.log('newMsg: ', message);
    // var li = $('<li></li>');
    // li.text(`${message.from} ${formattedTime} : ${message.msg}`);
    // $('#messages').append(li);
});

socket.on('chtMsg', function (msg) {
    console.log('chtMsg: ', msg);
});

socket.on('newLocationMsg', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm:ss a');
    var template = $('#locationmsgTemplate').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
    // var li = $('<li></li>');
    // var i = $();
    // var a = $('<a target="_blank">My Location<i class="fa fa-map-marker" style="font-size:36px"></i> My Current Location</a>');
    // a.attr('href', message.url);
    // li.text(`${message.from} ${formattedTime} : `);
    // li.append(a);

});

$('#message-form').on('submit', function (e) {
    e.preventDefault();
    var messageTextBox = $('[name=message]');
    socket.emit('createMsg', {
        from: 'User',
        msg: messageTextBox.val()
    }, function () {
        messageTextBox.val('');
    });
});

var locationButton = $('#geo-location');

locationButton.on('click', function (e) {
    e.preventDefault();
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location..');

    navigator.geolocation.getCurrentPosition(function (position) {

        locationButton.removeAttr('disabled').text('Send Location');

        socket.emit('createLocationMsg', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location.');
    });
});



