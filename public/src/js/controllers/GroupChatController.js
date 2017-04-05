/**
 * Created by sxh on 16/11/10.
 */

'use strict';

angular.module('esnApp')
    .controller('GroupChatCtrl', function($scope, $state, GroupChatService, SessionService) {

        $scope.groupname = SessionService.getGroup();
        $scope.providers = GroupChatService.getProviders();

        $scope.needers = GroupChatService.getNeeders();

        $scope.messages = GroupChatService.getGroupMessages();

        $scope.noidentities = GroupChatService.getNoIdentities();


        $scope.postGroupMessage = function (message) {
            if ($scope.newGroupMessage) {
                GroupChatService.postGroupMessage($scope.newGroupMessage);
                $scope.newGroupMessage = "";
            }
        };

    });