/*jshint sub:true */
/* globals CryptoJS */
'use strict';

angular.module('esnApp').factory('AuthService', function($q, $http, $state, SessionService, AUTH_EVENTS) {
    var authService = {};


    authService.signup = function(credentials) {
        var deferred = $q.defer();
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(credentials.password), 'secret key 666').toString();
        var c_credentials = JSON.parse(JSON.stringify(credentials));
        c_credentials.password = ciphertext;
        $http.post('/users/signup', c_credentials).then(function(res) {
            SessionService.createUser({
                'userId': res.data.user["_id"],
                'username': res.data.user['username'],
                'lastStatusCode': res.data.user['lastStatusCode'],
                'profile' : res.data.user['profile'],
                'privilage': res.data.user.privilage
            });
            deferred.resolve(res.data.user);
        }, function(error) {
            deferred.reject();
        });
        return deferred.promise;
    };

    authService.login = function(credentials) {
        var deferred = $q.defer();

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(credentials.password), 'secret key 666').toString();
        // var encrypted = $crypto.encrypt(credentials.password);
        var c_credentials = JSON.parse(JSON.stringify(credentials));
        // c_credentials.password = encrypted;
        c_credentials.password = ciphertext;
        // var encrypted = $crypto.encrypt(credentials.password);
        // var decrypted = $crypto.decrypt(encrypted, 'Team 666');
        // var c_credentials = JSON.parse(JSON.stringify(credentials));
        // c_credentials.password = encrypted;
        // credentials.password = encrypted;
        $http.post('/users/', c_credentials).then(function(res) {
            if (res.data.message) {
                switch (res.data.message) {
                    case AUTH_EVENTS.userNotFound:
                        deferred.reject(AUTH_EVENTS.userNotFound);
                        break;
                    case AUTH_EVENTS.notAuthenticated:
                        deferred.reject(AUTH_EVENTS.notAuthenticated);
                        break;
                    case AUTH_EVENTS.notAuthorized:
                      console.log("NOT AUTHORIZED");
                        deferred.reject(AUTH_EVENTS.notAuthorized);
                        break;
                    case AUTH_EVENTS.loginSuccess:
                        SessionService.createUser({
                            'userId': res.data.user._id,
                            'username': res.data.user.username,
                            'lastStatusCode': res.data.user.lastStatusCode,
                            'profile' : res.data.user['profile'],
                            'privilage': res.data.user.privilage
                        });
                        deferred.resolve(res.data.user);
                        break;
                    default:
                        //debugger;
                        break;
                }
            }
        }, function(error) {
            deferred.reject();
        });
        return deferred.promise;
    };

    authService.isAuthenticated = function() {
        return SessionService.getUserAuthenticated();
    };

    authService.isAuthorized = function(roles) {
        //TODO: later on adding more roles to the app
    };
    authService.unAuthorizeUser = function() {
        SessionService.destroyUser();
    };
    authService.getUser = function() {
        if (this.isAuthenticated()) {
            return SessionService.getUser();
        } else {
            return null;
        }
    };

    return authService;

});
