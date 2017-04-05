angular.module('esnApp')
    .factory('UserService', function($resource) {
        return $resource('/users/', {
            query: {
                method: 'GET'
            }
        });
    });
