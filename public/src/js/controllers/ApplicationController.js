angular.module("esnApp").controller('ApplicationCtrl', function($scope, $rootScope, AuthService, $state, AUTH_EVENTS, ChatService, PrivateMessageService, mySocket, Notification) {
  $scope.currentUser = null;

  $scope.isCollapsedHorizontal = true;
  $scope.isNavCollapsed = true;

  $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;
  };

  $scope.$on(AUTH_EVENTS.loginSuccess, function(event, data) {
    console.log('Data Recieved By ApplicationCtrl: ' + data.user._id);
    ChatService.addUser(data.user);
    $state.go('home', {newuser: null});
    $scope.setCurrentUser(data.user);
  });
  $scope.$on(AUTH_EVENTS.registerSuccess, function(event, data) {
    ChatService.addUser(data.user);
    console.log('Data Recieved By ApplicationCtrl: ' + data.user._id);
    $state.go('home', {newuser: data.user});
    $scope.setCurrentUser(data.user);
  });
  $scope.$on(AUTH_EVENTS.profileCreated, function(event, data) {
    console.log('Data Recieved By ApplicationCtrl: ' + data.user._id);
    $scope.setCurrentUser(data.user);
  });
  $scope.$on(AUTH_EVENTS.registerSuccess, function(event, data) {
    ChatService.addUser(data.user);
    console.log('Data Recieved By ApplicationCtrl: ' + data.user._id);
    $state.go('home', {newuser: data.user});
    $scope.setCurrentUser(data.user);
  });
  //no one emit??
  $scope.$on(AUTH_EVENTS.logoutSuccess, function(event, data) {
    console.log('User logout');
    $scope.setCurrentUser(null);
  });
  $scope.hanleLogOut = function() {
    $scope.isNavCollapsed = !$scope.isNavCollapsed;
    $scope.logOut();
  };

  $scope.handleEdit = function() {
    $scope.isNavCollapsed = !$scope.isNavCollapsed;
    $state.go('editProfile');
  }

  //alert pop up
  mySocket.on('Private Message', function(data) {
    Notification.primary(data.author + ": " + data.content);
    console.log("receive from author= " + data.author);
    // mySocket.emit('Read Reciept', data);
    $rootScope.$broadcast('PrivateMsgArrival', data);
  });

  mySocket.on('New Mail', function(data) {
    Notification.primary("You have a new mail from " + data.from + ": " + data.subject);
  });

  mySocket.on('Deactivate User', function(data) {
    if(data === $scope.currentUser.username) {
      console.log("Access Denied. Please contact your system administrator.");
      ChatService.removeUser($scope.currentUser);
      AuthService.unAuthorizeUser();
      $scope.setCurrentUser(null);
      $state.go('error', {errormessage: "Access Denied. Please contact your system administrator for assistance."});
    }
  });

  $scope.openPrivateChat = function(target){
    $state.go('privateChat', {target: target});
  };
  $scope.openMail = function(target){
    $state.go('mail', {target: target});
  };

  $scope.handleCollapse = function() {
    if (!$scope.isNavCollapsed) {
      $scope.isNavCollapsed = !$scope.isNavCollapsed;
    }
  };
  $scope.logOut = function () {
    ChatService.removeUser($scope.currentUser);
    AuthService.unAuthorizeUser();
    $scope.setCurrentUser(null);
    $state.go('login');
  };
  ;(function(AuthService, $scope) {
    $scope.setCurrentUser(AuthService.getUser());
    if($scope.currentUser) {
      ChatService.addUser($scope.currentUser);
    }
  })(AuthService, $scope);
});
