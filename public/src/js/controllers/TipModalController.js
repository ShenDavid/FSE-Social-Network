esnApp.controller('TipModalCtrl', function ($uibModalInstance, $rootScope, title, styles, type) {
  var $ctrl = this;
  $ctrl.title = title;
  $ctrl.type = type;
  $ctrl.styles = styles;

  $ctrl.ok = function () {

      $uibModalInstance.close('testParameter');
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
