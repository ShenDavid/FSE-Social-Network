/**
 * Created by sxh on 16/11/11.
 */

angular.module('esnApp')
    .factory('GroupMessageService', function($resource) {
        return {
            needers: $resource('/groupchat/needers', {
                query: {
                    method: 'GET',
                    params: {grouptag: '@grouptag'}

                }
            }),
            offers: $resource('/groupchat/offers', {
                query: {
                    method: 'GET',
                    params: {grouptag: '@grouptag'}

                }
            }),
            messages: $resource('/groupchat/messages', {
                query: {
                    method: 'GET',
                    params: {grouptag: '@grouptag'}
                }
            }),
            noidentities: $resource('/groupchat/noidentities', {
                query: {
                    method: 'GET',
                    params: {grouptag: '@grouptag'}
                }
            })
        };

    });
