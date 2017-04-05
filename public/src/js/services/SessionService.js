angular.module('esnApp').service('SessionService', function ($sessionStorage) {
  this.createUser = function(user) {
    $sessionStorage.user = user;
    $sessionStorage.userIsAuthenticated = true;
  };
  this.destroyUser = function () {
    delete $sessionStorage.user;
    $sessionStorage.userIsAuthenticated = false;
  };
  this.getUserAuthenticated = function () {
    if (!$sessionStorage.userIsAuthenticated) {
      $sessionStorage.userIsAuthenticated = false;
    }
    return $sessionStorage.userIsAuthenticated;
  };
  this.getUser = function () {
    return $sessionStorage.user;
  };
  this.updateStatus = function(status) {
    $sessionStorage.user.lastStatusCode=status;
  };

  this.saveGroup = function(groupname){
    $sessionStorage.groupname = groupname;
  };
  this.getGroup = function(){
    return $sessionStorage.groupname;
  };

});
