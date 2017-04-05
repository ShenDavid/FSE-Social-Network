// PrivateMessageService boilerplate
angular.module('esnApp')
    .factory('PrivateMessageService', function($resource) {
        return {
            PrivateMsgs: $resource('/messages/private', {
                query: {
                    method: 'GET',
                    params: {
                        target: '@target',
                        authorname: '@authorname'
                    }

                },
                save: {
                    method: 'POST'
                },
            }),
            queryUnreadMsgs: $resource('/messages/private/unread', {
                query: {
                    method: 'GET',
                    params: {
                        target: '@authorname'
                    }
                },
            })
        };
    });
