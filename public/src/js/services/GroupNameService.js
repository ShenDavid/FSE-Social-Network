/**
 * Created by sxh on 16/11/11.
 */


angular.module('esnApp')
    .factory('GroupNameService', function($resource) {
        return {
            names: $resource('/groupin', {
                query: {
                    method: 'GET'

                }
            })
        };

    });
