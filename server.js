var express = require('express'),
    app = express(),
    config = require('./config'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

//var announceCtrl = require('./controllers/announceCtrl');
var sockets = require('./sockets/sockets');
var io;

//MongoDB instance
var db = mongoose.connect(config.mongoUrl);
mongoose.connection.on('open', function() {
    console.log('MongoDB connected successfully!');
});
var Users = require('./models/user');
Users.init(function(err,trace){console.log(err)});

app.use(express.static(config.root + '/public'));
app.use(express.static(config.root + '/bower_components'));
app.use(express.static(config.root + '/uploads'));


// Routes
var users = require('./routers/usersRouter');
var chats = require('./routers/chatRouter');
var announcements = require('./routers/announcementRouter');
var searchInfo = require('./routers/searchInfoRouter');
var maps = require('./routers/mapRouter');
var mails = require('./routers/mailRouter');
var groupchat = require('./routers/groupRouter');
var groupin = require('./routers/groupInRouter');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// RESTful API
app.use('/users', users);
app.use('/messages', chats);
app.use('/announcements', announcements);
app.use('/searchinfo', searchInfo);
app.use('/map', maps);
app.use('/mails', mails);
app.use('/groupchat', groupchat);
app.use('/groupin', groupin);

app.get('/', function(req, res) {
    res.sendFile(config.root + '/public/src/views/index.html');
});

var server;

exports.start = function(cb) {
    server = app.listen(config.port, function() {
        io = sockets(server);
        console.log('Server Up on: ' + config.port);

        if (cb) {
            cb();
        }
    });
};

exports.close = function(cb) {
    if (io) io.close();
    if (server) server.close(cb);
};

// when app.js is launched directly
if (module.id === require.main.id) {
    exports.start();
}
