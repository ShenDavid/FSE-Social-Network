/**
 * Created by sxh on 16/11/25.
 */

'use strict';

angular.module('esnApp').factory('GroupMapService', function($state, mySocket, GroupInService, SessionService) {

    return{
        StartGroupChat: function(newUsersGroup, targets){
            console.log("targets = " + targets);
            if(targets && newUsersGroup) {
                angular.forEach(targets, function(user) {
                    console.log("user name= " + user);
                    GroupInService.createGroup(newUsersGroup, 'undefined', user);
                });

                SessionService.saveGroup(newUsersGroup);
                $state.go('groupchat');
            }
        }
    }
});