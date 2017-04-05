'use strict';

angular.module('esnApp')
    .controller('PublicChatCtrl', function($scope, $stateParams, ChatService, mySocket) {
        $scope.messages = ChatService.getMessages();

        mySocket.on('Public Message', function(data) {
          $scope.messages.push(data);
        });

        $scope.postPublicMessage = function (message) {
          if ($scope.newMessage) {
              ChatService.sendMessage($scope.newMessage);
              $scope.newMessage = "";
          }
        };

    });
