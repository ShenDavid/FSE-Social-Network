angular.module('esnApp')
    .controller('HomeCtrl', function($uibModal, $log, $scope, $stateParams, StatusService, PostAnnounceService, mySocket, AuthService, $state, SessionService) {
        $ctrl = this;
        $scope.currentUser = AuthService.isAuthenticated();
        $scope.authUser = null;


        if ($scope.currentUser) {
            $scope.status = StatusService.getStatus();
            $scope.authUser = SessionService.getUser();
            console.log("authUser: " + $scope.authUser);
        }

        $scope.shareStatus = function(status) {
            console.log("test");
            if ($scope.status) {
                StatusService.sendStatus($scope.status);
            }
        };

        $scope.announcements = PostAnnounceService.getAnnouncements();
        $scope.postAnnouncements = function() {
            console.log("scope announce: " + $scope.newAnnouncement);
            if ($scope.newAnnouncement) {
                PostAnnounceService.postAnnouncements($scope.newAnnouncement);
                $scope.newAnnouncement = "";
            }
        };

        $ctrl.open = function(size, title, type, url, message) {
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: url,
                controller: 'TipModalCtrl',
                controllerAs: '$ctrl',
                size: size,
                type: type,
                resolve: {
                    title: function() {
                        return title;
                    },
                    type: function() {
                        return type;
                    },

                    styles: function() {
                        return {
                            'title': {
                                'color': 'red'
                            }
                        };
                    },
                    message: function() {
                        return message;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                $state.go('editProfile');
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());


            });
        };
        $ctrl.openTip = function(size, title, type) {
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'myModalContent.html',
                controller: 'TipModalCtrl',
                controllerAs: '$ctrl',
                size: size,
                type: type,
                resolve: {
                    title: function() {
                        return title;
                    },
                    type: function() {
                        return type;
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
                console.log(data);

            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.open = $ctrl.open;
        $scope.openTip = $ctrl.openTip;
        var newuser = $stateParams.newuser;
        if (newuser !== null) {
            $ctrl.open('sm', 'Create Profile', false, 'myModalProfile.html', "Do you want to create a profile for your account?");

            // $ctrl.open('sm', 'Status Code Tips', true, 'myModalContent.html', "");
            console.log("newuser = " + newuser.username);
        }

    });
