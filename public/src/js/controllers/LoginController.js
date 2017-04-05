'use strict';

angular.module('esnApp')
    .controller('LoginCtrl', function($uibModal, $sanitize, $log, $rootScope, $scope, $state, AuthService, blacklist, AUTH_EVENTS) {
        var $ctrl = this;
        $ctrl.animationsEnabled = true;
        $scope.blacklist = blacklist;

        $ctrl.open = function(size, title, type) {
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: size,
                type: type,
                resolve: {
                    title: function() {
                        return title;
                    },
                    credentials: function() {
                        return $scope.credentials;
                    },
                    type: function() {
                        return type;
                    },
                    message: function() {
                        return $ctrl.message;
                    },
                    styles: function() {
                        return {
                            'title': {
                                'color': 'red'
                            }
                        };
                    }
                }
            });

            modalInstance.result.then(function(data) {
                if (data.event === AUTH_EVENTS.registerSuccess) {
                    $rootScope.$broadcast(AUTH_EVENTS.registerSuccess, {
                        'user': data.user
                    });
                }

            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        $ctrl.toggleAnimation = function() {
            $ctrl.animationsEnabled = !$ctrl.animationsEnabled;
        };

        $scope.credentials = {
            username: '',
            password: ''
        };

        $scope.login = function(credentials) {
            AuthService.login(credentials).then(function(user) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, {
                    'user': user
                });
            }, function(err) {
                if (err === AUTH_EVENTS.notAuthenticated) {
                    $ctrl.message = "Incorrect password";
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    $ctrl.open('sm', '<span class="glyphicon glyphicon-exclamation-sign"></span>' + ' Login Failed', AUTH_EVENTS.notAuthenticated);
                }

                else if (err === AUTH_EVENTS.notAuthorized) {
                    $ctrl.message = "Access Denied.  Please contact your system administrator for assistance.";
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    $ctrl.open('sm', '<span class="glyphicon glyphicon-exclamation-sign"></span>' + ' Login Failed', AUTH_EVENTS.notAuthorized);
                }

                if (err === AUTH_EVENTS.userNotFound) {
                    $ctrl.message = "The username you provided does not exist Do you want to register an account with Code Alpha?";
                    $ctrl.open('sm', '<span class="glyphicon glyphicon-exclamation-sign"></span>' + ' User Not Found', AUTH_EVENTS.userNotFound);
                }
            });
        };
    });
