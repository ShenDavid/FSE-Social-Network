'use strict';

angular.module('esnApp').controller('AnnounceCtrl', function($scope, PostAnnounceService) {

    $scope.announcements = PostAnnounceService.getAnnouncements();
    $scope.postAnnouncements = function() {
        if ($scope.newAnnouncement) {
            PostAnnounceService.postAnnouncements($scope.newAnnouncement);
            $scope.newAnnouncement = "";
        }
    };
});
