'use strict';

angular.module('esnApp').factory('ChatService', function(mySocket, MessageService, PrivateMessageService, AuthService) {

  var messages; //= MessageService.PublicMsgs.query();//MessageService.query();
  var privatemessages;

  return {
    getMessages: function() {
      //debugger;
      messages = MessageService.PublicMsgs.query();
      return messages;
    },
    sendMessage: function(message) {
      var data = {
        content: message,
        author: AuthService.getUser().username,
        postedAt: Date.now()
      };
      mySocket.emit('Public Message', data);
      //REST API+++
      MessageService.PublicMsgs.save(data);
      //REST API---
      messages.push(data);
    },
    sendPrivateMessage: function(message, target) {
      var data = {
        content: message,
        author: AuthService.getUser().username,
        target: target, //for private message
        postedAt: Date.now()
      };
      mySocket.emit('Private Message', data);
      //REST API+++
      PrivateMessageService.PrivateMsgs.save(data);
      //REST API---
      privatemessages.push(data);
    },
    addUser: function(user) {
      mySocket.emit('Logged In', user);
    },
    removeUser: function(user) {
      mySocket.emit('Logged Out', user);
    },
    getPrivateMessages: function(them){
      privatemessages  = PrivateMessageService.PrivateMsgs.query({target: AuthService.getUser().username,
                                    authorname: them}
      );
      return privatemessages;
    }
  };
});
