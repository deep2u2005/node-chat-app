// unix epic date =  Jan 1st 1970 00:00:00 am
var moment = require('moment');

var date = moment()

date.add(1,'Q');

console.log(date.format('Do MMM, YYYY , h:mm:ss a'));

