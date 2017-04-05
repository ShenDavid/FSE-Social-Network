// MessageService boilerplate
angular.module('esnApp')
    .factory('MessageService', function($resource) {

        return {
          PublicMsgs: $resource('/messages/public', {
                query: {
                    method: 'GET'
                },
                save: {
                    method: 'POST'
                },
          }),

        };
    });
