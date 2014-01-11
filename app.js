
/**
 * Module dependencies.
 */

var express = require('express');
var gesture = require('./routes/gestures');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/gestures/index', gesture.allDatabaseIdentifiers);
app.get('/gestures/:db/names', gesture.allStrokeSequenceNames);
app.get('/gestures/:db', gesture.allGesturesInDatabase);
app.get('/gestures/:db/:gestureName', gesture.gesturesWithName);
app.post('/gestures/:db/:gestureName', gesture.addGesture);
app.delete('/gestures/:db/:signature', gesture.removeGestureWithSignature);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
