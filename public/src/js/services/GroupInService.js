/**
 * Created by sxh on 16/11/10.
 */

'use strict';

angular.module('esnApp').factory('GroupInService', function(mySocket, GroupNameService, AuthService) {
    var groups;
    console.log("group service before: " +groups);

    return {
        getGroups: function () {

            groups =  GroupNameService.names.query();
            //debugger;
            console.log("group in service!: " +groups);
            return groups;
        },
        createGroup: function(newGroup, identity, username){
            var data = {
                grouptag: newGroup,
                identity: identity,
                author: username
                //messageType: "groupmem"
            };
            mySocket.emit('Create Group', data);
            //groups.push(data.grouptag);
        },
        joinGroup: function(groupname, identity) {
            var data = {
                grouptag: groupname,
                identity: identity,
                author: AuthService.getUser().username
                //messageType: "groupmem"
            };
            mySocket.emit('Join Group', data);
        }
    };
});
