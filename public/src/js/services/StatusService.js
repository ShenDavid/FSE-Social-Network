'use strict';

angular.module('esnApp').factory('StatusService', function(mySocket, AuthService, SessionService) {

    return {
        sendStatus: function(status) {
            var data = {
                status: status,
                name: AuthService.getUser().username,
            };
            mySocket.emit('Share Status', data);
            SessionService.updateStatus(status);
        },
        getStatus: function() {
            var last = SessionService.getUser().lastStatusCode;
            return last;
        }

    };
});
