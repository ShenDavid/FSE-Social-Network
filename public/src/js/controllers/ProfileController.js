angular.module('esnApp')
    .controller('ProfileController', function($rootScope, $scope, $stateParams, AUTH_EVENTS, mySocket, profileService, MailService, SessionService, Upload, UserService, AuthService, Notification) {
        if ($stateParams.targetUser) {
            profileService.getProfile($stateParams.targetUser).then(function(res) {
                $scope.targetUser = res;
                $scope.profile = res.profile;
                $scope.radioModel = $scope.targetUser.privilage;
                $scope.newUsername = $scope.targetUser.username;
            });
        } else {
            profileService.getProfile().then(function(res) {
                $scope.targetUser = res;
                $scope.profile = res.profile;
                $scope.userList = UserService.query();
                $scope.radioModel = $scope.targetUser.privilage;
                $scope.newUsername = $scope.targetUser.username;
                console.log($scope.userList.length);
                // debugger;
                // $scope.userList = userList.filter(function(user, index) {
                //   return user.profile.name !== $scope.profile.name;
                // })
            });
        }
        $scope.currentUser = AuthService.getUser();
        $scope.writePrivilage = ($scope.currentUser.privilage === "Administrator");

        $scope.newAlert = false;
        $scope.uploadProfile = function() {
            profileService.uploadProfile({
                file: $scope.picFile,
                profile: $scope.profile
            }).then(function(res) {
                SessionService.createUser({
                    'userId': res.data.user["_id"],
                    'username': res.data.user['username'],
                    'lastStatusCode': res.data.user['lastStatusCode'],
                    'profile': res.data.user['profile'],
                    'privilage': res.data.user.privilage
                });
                $rootScope.$broadcast(AUTH_EVENTS.profileCreated, {
                    'user': res.data.user
                });
                $scope.newAlert = true;
            }, function(err) {
                console.log(err);
            });
        };


        $scope.DeactivateUser = function (username) {
          if (username === "ESNAdmin"){
            console.log("You can not deactivate the ESNAdmin. ")
          }
          else {
            mySocket.emit('Deactivate User', username);
            $scope.targetUser.active = false;
          }
        };

        $scope.ActivateUser = function (username) {
          mySocket.emit('Activate User', username);
          $scope.targetUser.active = true;
        };


        $scope.setUsername = function(){
          console.log("SET USERNAME ", $scope.targetUser.username)
          profileService.setUsername( $scope.targetUser.username, $scope.newUsername);
          $scope.targetUser.username = $scope.newUsername;

          if ($scope.targetUser.username === $scope.currentUser) {
            $scope.currentUser = $scope.newUsername;
          }
        }

        $scope.setPrivilage = function (username ) {
          console.log($scope.radioModel);
          profileService.setPrivilage($scope.targetUser.username, $scope.radioModel);
        }

        $scope.newPassword = null;
        $scope.setPassword = function (username ) {
          profileService.setPassword($scope.targetUser.username, $scope.newPassword);
        }


        $scope.addFamilyMember = function(username) {
          $scope.profile.familyMembers.push($scope.selected);
        };

        $scope.removeFamilyMember = function(username) {
          var index = $scope.profile.familyMembers.indexOf(username);
          $scope.profile.familyMembers.splice(index, 1);
        };


        var _selected;

        $scope.selected = undefined;
        $scope.ngModelOptionsSelected = function(value) {
            if (arguments.length) {
                _selected = value;
            } else {
                return _selected;
            }
        };

        $scope.modelOptions = {
            debounce: {
                default: 500,
                blur: 250
            },
            getterSetter: true
        };


        $scope.isComposePopupVisible = false;
        $scope.composeEmail = {};
        $scope.showComposePopup = function() {
            $scope.composeEmail = {};
            $scope.composeEmail.to = $stateParams.targetUser;
            $scope.isComposePopupVisible = true;
        };
        $scope.closeComposePopup = function() {
            $scope.isComposePopupVisible = false;
        };
        $scope.sendEmail = function() {
          console.log($scope.currentUser);
            MailService.addMail($scope.currentUser.username, $scope.composeEmail.to, $scope.composeEmail.subject, $scope.composeEmail.body);
            $scope.isComposePopupVisible = false;
            $scope.composeEmail.from = "me";
            $scope.composeEmail.date = new Date();
            Notification.success("Sent mail to " + $scope.composeEmail.to + " successfully!");
        };


    });
