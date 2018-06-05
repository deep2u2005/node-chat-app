
var socket = io();

function scrollToBottom() {
}

socket.on('connect', function () {
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        }
        else {
            console.log('Node chat app started');
        }
    });
});

socket.on('disconnect', function () {
    console.log('Node chat app closed');
});

socket.on('updateUserList', function (users) {
    var params = jQuery.deparam(window.location.search);
    var currentUser = params.name;
    var ul = $('<ul></ul>');
    users.forEach(function (user) {
        if (currentUser === user) {
            var a = $('<a></a>');
        }
        else {
            var a = $('<a target="_blank" href="!"></a>');
        }
        var li = $('<li></li>');
        a.text(user);
        li.append(a);
        ul.append(li);
    });

    $('#users').html(ul);
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

var msgButton = $('#btnMsg');
//emojionearea-editor msg-box
$('#msg-box').on('submit', function (e) {
    e.preventDefault();

    msgButton.text('Sending..');

    var messageTextBox = $('[name=message]');
    var emojiArea = $('.emojionearea-editor');
    socket.emit('createMsg', {
        msg: messageTextBox.val()
    }, function () {
        messageTextBox.val('');
        emojiArea.text('');
        msgButton.text('Send');
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



