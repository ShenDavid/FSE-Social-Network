/**
 * Created by sxh on 16/11/10.
 */

'use strict';

angular.module('esnApp')
    .controller('GroupInCtrl', function($scope, $state, GroupInService, SessionService, AuthService) {
        //var groups = GroupInService.getGroups();

        $scope.groups = GroupInService.getGroups();
        console.log("group controller before: " +$scope.groups);

        $scope.createGroup = function (message) {
            var isdif = true;
            if($scope.identity && $scope.newGroup){
                angular.forEach($scope.groups, function(value, key) {
                    console.log('value!  ' + value);
                    console.log('key!  ' + value);
                    if(value === $scope.newGroup){
                        isdif = false;
                    }
                });
                if(isdif) {
                    GroupInService.createGroup($scope.newGroup, $scope.identity, AuthService.getUser().username);
                    SessionService.saveGroup($scope.newGroup);
                    $state.go('groupchat');
                }
                else{
                    $scope.newGroup.placeholder = "Please type a group name different from existing ones";
                }

            }
        };

        $scope.joinGroup = function (groupname) {
            console.log("groupname: " + groupname);
            console.log("identity: " + $scope.identity);
             if($scope.identity){

                GroupInService.joinGroup(groupname, $scope.identity);
            }
            else{
                 GroupInService.joinGroup(groupname, 'undefined');
             }
            SessionService.saveGroup(groupname);
            $state.go('groupchat');
        };

    });