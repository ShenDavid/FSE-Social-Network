angular.module('esnApp')
    .controller('ErrorController', function($rootScope, $scope, $stateParams, AUTH_EVENTS, AuthService, Notification) {
      $scope.displayError = $stateParams.errormessage;
    });
