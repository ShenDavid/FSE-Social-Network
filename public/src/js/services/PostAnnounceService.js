'use strict';

angular.module('esnApp').factory('PostAnnounceService', function(mySocket, GetAnnounceService, AuthService) {

    var announcements = GetAnnounceService.query();

    return {
        getAnnouncements: function() {
            return announcements;
        },
        postAnnouncements: function(announcement) {
            var data = {
                content: announcement,
                author: AuthService.getUser().username,
                postedAt: Date.now()
            };
            GetAnnounceService.save(data);

            announcements.unshift(data);
        }
    };
});
