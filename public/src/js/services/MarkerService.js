'use strict';

angular.module('esnApp')
    .factory('MarkerService', function($resource, $http) {
        return {
          EditMarker: $resource('/map/markers', {
                query: {
                    method: 'GET'
                },
                save: {
                    method: 'POST'
                },
          }),
          RemoveMarker: function(id) {
            $http({
                method: 'DELETE',
                url: '/map/markers',
                data: {
                    id: id
                },
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then(function (response) {
              if (response.data)
                  console.log("DELETE returns:");
                  console.log(response.data);
              });
          }
        };
    });
