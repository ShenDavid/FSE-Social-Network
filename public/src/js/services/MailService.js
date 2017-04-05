'use strict';

angular.module('esnApp').factory('MailService', function($http, $q, mySocket, $resource) {

    return {

        findInMails: function(to) {
            var deferred = $q.defer();
            var data = JSON.parse(JSON.stringify({
                to: to
            }));
            $http.post('/mails/inmails', data).then(function(res) {
                deferred.resolve(res.data.mails);
            }, function(error) {
                deferred.reject();
            });
            return deferred.promise;
        },
        findSentMails: function(from) {
            var deferred = $q.defer();
            var data = JSON.parse(JSON.stringify({
                from: from
            }));
            $http.post('/mails/sentmails', data).then(function(res) {
                deferred.resolve(res.data.mails);
            }, function(error) {
                deferred.reject();
            });
            return deferred.promise;
        },
        deleteMail: function(from, to, subject, body) {
            var deferred = $q.defer();
            var data = JSON.parse(JSON.stringify({
                from: from,
                to: to,
                subject: subject,
                body, body
            }));
            $http.post('/mails/delete', data).then(function(res) {

            }, function(error) {
                deferred.reject();
            });
        },

        addMail: function(from, to, subject, body) {
            var data = {
              to: to,
              from: from,
              subject: subject
            };
          mySocket.emit('New Mail', data);
            var deferred = $q.defer();
            var data = JSON.parse(JSON.stringify({
                from: from,
                to: to,
                subject: subject,
                body: body
            }));
            $http.post('/mails/', data).then(function(res) {
                deferred.resolve(res.data.newMail);
            }, function(error) {
                deferred.reject();
            });
            return deferred.promise;
        }
    };
});
