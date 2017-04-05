'use strict';

angular.module('esnApp')
    .controller('PrivateChatCtrl', function($scope, $stateParams, ChatService, mySocket) {

      $scope.targetName = $stateParams.target;
      $scope.privatemessages = ChatService.getPrivateMessages( $stateParams.target);

      // mySocket.on('Private Message', function(data) {
      //   $scope.privatemessages.push(data);
      //     debugger
      //   console.log("receive from others: " + data);
      //   mySocket.emit('Read Reciept', data);
      // });

      //wanya+++
      $scope.$on('PrivateMsgArrival', function(event, data) {
          $scope.privatemessages.push(data);
//            debugger
          mySocket.emit('Read Reciept', data);
      });
      //wanya---

        $scope.postPrivateMessage = function (message) {
          //heyq
          if ($scope.newPrivateMessage) {
              ChatService.sendPrivateMessage($scope.newPrivateMessage, $stateParams.target);
              $scope.newPrivateMessage = "";
          }
        };




    });
