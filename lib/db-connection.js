
var mongoose = require('mongoose');

//mongoose.connect('development' == app.get('env') ?
//					'mongodb://localhost/mp-gestures' :
//					'mongodb://mp-gestures:bPGEXkz9afcTJ8CGc@dharma.mongohq.com:10052/mp-gestures-online');

var conn = mongoose.connect('mongodb://mp-gestures:bPGEXkz9afcTJ8CGc@dharma.mongohq.com:10052/mp-gestures-online');

module.exports = conn;