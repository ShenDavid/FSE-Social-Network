'use strict';

angular.module('esnApp').factory('profileService', function(AuthService, SessionService, $q, $http, $timeout, Upload) {
    var profileService = {};

    profileService.uploadProfile = function(data) {
        var deferred = $q.defer();
        var file = data.file;
        file.upload = Upload.upload({
            url: '/users/profile',
            data: {
                file: file,
                profile: data.profile,
                username: AuthService.getUser().username
            },
        });
        file.upload.then(function (res) {
          $timeout(function() {
            deferred.resolve(res);
          })
        })
        return deferred.promise;
    };

    profileService.getProfile = function(username) {
      var deferred = $q.defer();
      if (username) {
        $http.get('/users/profile/' + username).then(function(res) {
          deferred.resolve(res.data);
        }, function(err) {

        });
      } else {
        $http.get('/users/profile/' + AuthService.getUser().username).then(function(res) {
          deferred.resolve(res.data);
        }, function(err) {

        });
      }

      return deferred.promise;
    }

    profileService.setUsername = function(target, newname) {
      var deferred = $q.defer();
      var data = {target:target, newname:newname};
      $http.post('/users/profile/username' , data).then(function(res) {
          deferred.resolve(res.data);
      }, function(err) {
      });
      return deferred.promise;
    }

    profileService.setPrivilage = function(target, privilage) {
      var deferred = $q.defer();
      var data = {target:target, privilage:privilage};
      $http.post('/users/profile/privilage', data).then(function(res) {
          deferred.resolve(res.data);
      }, function(err) {
      });
      return deferred.promise;
    }

    profileService.setPassword = function(target, password) {
      var deferred = $q.defer();
      var data = {target:target, password:password};
      $http.post('/users/profile/password', data).then(function(res) {
          deferred.resolve(res.data);
      }, function(err) {
      });
      return deferred.promise;
    }

    return profileService;
});
