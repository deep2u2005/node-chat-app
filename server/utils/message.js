var moment = require('moment');
var timeStamp = new Date().getTime();

var generateMessage = (from, msg) => {
    return {
        from,
        msg,
        createdAt: moment().valueOf()
    }
};

var generateLocationMessage = (from, latitude, longitude) => {
    return {
        from,
        url: `https://www.google.com/maps/?q=${latitude},${longitude}`,
        createdAt: moment().valueOf()
    }
};

module.exports = { generateMessage, generateLocationMessage };

