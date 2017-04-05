/**
 * Created by sxh on 16/11/10.
 */

'use strict';

angular.module('esnApp').factory('GroupChatService', function(mySocket, GroupMessageService, AuthService, SessionService) {
    var providers;
    var needers;
    var messages;
    var noidentities;
    //console.log("group service before: " +groups);
    mySocket.on('Post Group', function (data) {
        messages.push(data);
    });

    return {
        getProviders: function () {
            var data = {
                grouptag: SessionService.getGroup()
            };
            providers = GroupMessageService.offers.query(data);
            return providers;
        },
        getNeeders: function () {
            //console.log("session group "+SessionService.getGroup());
            var data = {
                grouptag: SessionService.getGroup()
            };
            needers = GroupMessageService.needers.query(data);
            return needers;
        },
        getGroupMessages: function () {
            var data = {
                grouptag: SessionService.getGroup()
            };
            messages = GroupMessageService.messages.query(data);
            return messages;
        },
        getNoIdentities: function () {
            var data = {
                grouptag: SessionService.getGroup()
            };
            noidentities = GroupMessageService.noidentities.query(data);
            return noidentities;
        },
        postGroupMessage: function (newMessage) {

            var data = {
                content: newMessage,
                author: AuthService.getUser().username,
                grouptag: SessionService.getGroup(),
                postedAt: Date.now()
                //messageType: "groupmem"
            };
            mySocket.emit('Post Group', data);
            messages.push(data);
        }
    };

});
