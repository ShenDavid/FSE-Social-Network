(function(angular) {
  'use strict';
angular.module('esnApp').controller('UserCtrl', function($scope, $state, $uibModal, UserService, AuthService, mySocket) {
  $scope.users = UserService.query();
  mySocket.on('Offline', function() {
    $scope.users = UserService.query();
  });
  mySocket.on('Online', function() {
    $scope.users = UserService.query();
  });
  mySocket.on('Change Status', function() {
    $scope.users = UserService.query();
  });

  $scope.editSelfProfile = function() {
    $state.go('editProfile');
  };

  $scope.viewProfile = function(username) {
    $state.go('viewProfile', {targetUser: username});
  };

  $scope.openPrivateChat = function(target) {
      console.log("target = " + target);
      $state.go('privateChat', {target: target});
  };

  $scope.currentUser = AuthService.getUser();

});
})(window.angular);
