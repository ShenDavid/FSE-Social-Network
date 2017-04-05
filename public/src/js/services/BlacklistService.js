angular.module('esnApp')
    .factory('BlacklistService', function($http) {
        return {
            get: function() {
                return $http.get('src/assets/blacklist.json').then(function(response) {
                    return response.data;
                });
            }
        };
    });
