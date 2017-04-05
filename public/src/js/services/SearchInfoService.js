'use strict';

angular.module('esnApp').factory('SearchInfoService', function($http, $q, AuthService) {

  return {
    getCitizenByUsername: function(username) {
      var deferred = $q.defer();
      var data = JSON.parse(JSON.stringify({username:username}));
      $http.post('/searchinfo/name', data).then(function(res) {
          deferred.resolve(res.data.users);
      }, function(error) {
          deferred.reject();
      });
      return deferred.promise;
    },
    getCitizenByStatusCode: function(statusCode) {
      var deferred = $q.defer();
      var data = JSON.parse(JSON.stringify({status:statusCode}));
      $http.post('/searchinfo/status', data).then(function(res) {
          deferred.resolve(res.data.users);
      }, function(error) {
          deferred.reject();
      });
      return deferred.promise;
    },
    getAnnouncement: function(words) {
      var deferred = $q.defer();
      var data = JSON.parse(JSON.stringify({words:words}));
      $http.post('/searchinfo/announcements', data).then(function(res) {
          deferred.resolve(res.data.announcements);
      }, function(error) {
          deferred.reject();
      });
      return deferred.promise;
    },
    getPublicMessages: function(words) {
      var deferred = $q.defer();
      var data = JSON.parse(JSON.stringify({words:words}));
      $http.post('/searchinfo/public', data).then(function(res) {

          deferred.resolve(res.data.publicMessages);
      }, function(error) {
          deferred.reject();
      });
      return deferred.promise;
    },
    getPrivateMessages: function(words) {
      var deferred = $q.defer();
      var data = JSON.parse(JSON.stringify({words:words, username: AuthService.getUser().username}));
      $http.post('/searchinfo/private', data).then(function(res) {

          deferred.resolve(res.data.privateMessages);
      }, function(error) {
          deferred.reject();
      });
      return deferred.promise;
    },
    getStopWords: function() {
      return $http.get('src/assets/stopwords.json').then(function(response) {
          return response.data;
      });
    }

  };
});
