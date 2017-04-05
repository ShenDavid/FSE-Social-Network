esnApp.controller('ModalInstanceCtrl', function ($uibModalInstance, $rootScope,message, title, styles, type, credentials, AUTH_EVENTS, AuthService) {
  var $ctrl = this;
  $ctrl.message = message;
  $ctrl.title = title;
  $ctrl.type = type;
  $ctrl.credentials = credentials;
  // $ctrl.selected = {
  //   item: $ctrl.items[0],
  //   option: true
  // };
  $ctrl.styles = styles;

  $ctrl.ok = function () {
    if ($ctrl.type === AUTH_EVENTS.userNotFound) {
        AuthService.signup($ctrl.credentials).then(function(user) {
          $uibModalInstance.close({"event":AUTH_EVENTS.registerSuccess, "user":user});
        }, function() {
          $ctrl.message = 'Failed Signing Up';
        });
    } 
    else {
      $uibModalInstance.close({"event":AUTH_EVENTS.loginFailed});
    }
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
