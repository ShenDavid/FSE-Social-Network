/* jshint node: true */
/* socket.io

Documentation found in /docs/socketinteface.md

Assupmtion: Once a user is logged in, they will recieve public
message broadcasts.  There is no separate concept of joining and leavinng the
public chat.

*/
"use strict";

var io = require('socket.io');
var joinCommunity = require('../controllers/userCtrl.js');
var chatPublicaly = require('../controllers/PublicChatCtrl.js');
var chatPrivately = require('../controllers/PrivateChatCtrl.js');
var groupChat = require('../controllers/groupCtrl.js');
var mail = require('../controllers/MailCtrl.js');
var profile = require('../controllers/userProfileCtrl.js');

var users = {};
var sockets = {};
//only this

function socketConnection(socket) {
  socket.on('Logged In' , joinCommunity.userEnters(io, socket, users));
  socket.on('Logged Out', joinCommunity.userExits(socket));
  socket.on('Public Message', chatPublicaly.postPublicMessage(socket));

  socket.on('Private Message', chatPrivately.postPrivateMessage(socket, users));
  socket.on('Read Reciept', chatPrivately.readReciept(socket));
  socket.on('New Mail', mail.notifyMail(socket, users));


  socket.on('disconnect', joinCommunity.userExits(socket));
  socket.on('Share Status', joinCommunity.editStatus(socket));

    socket.on('Create Group', groupChat.createGroup(socket));
    socket.on('Join Group', groupChat.joinGroup(socket));
    socket.on('Post Group', groupChat.postMessage(socket));

  socket.on('Activate User', profile.ActivateUser(socket));
  socket.on('Deactivate User', profile.DeactivateUser(socket));
}


module.exports = function init(server) {
    io = io(server);
    io.sockets.on('connection', socketConnection);
    return io;
};
