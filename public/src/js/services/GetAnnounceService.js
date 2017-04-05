angular.module('esnApp')
    .factory('GetAnnounceService', function($resource) {
        return $resource('/announcements', {
              query: {
                  method: 'GET'
              },
              save: {
                  method: 'POST',
                  params: { author : '@author',
                            content: '@content'
                          }
              }
          });
    });
