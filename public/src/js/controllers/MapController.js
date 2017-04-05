angular.module('esnApp')
  .controller('MapCtrl', [ "$scope", "AuthService", "MarkerService", "GroupMapService", "leafletMarkerEvents", "leafletData", "leafletBoundsHelpers", "ngDialog", "$state", function($scope, AuthService, MarkerService, GroupMapService, leafletMarkerEvents, leafletData, leafletBoundsHelpers, ngDialog, $state) {
    var username = AuthService.getUser().username;
    var curCord = {lat: Number.NaN, lng: Number.NaN};
    //var viewProfileEvent = 'ng-click="$event.preventDefault();$state.go("viewProfile", {targetUser: username})';
    // Initialise the feature group to store editable layers
    var drawnItems = new L.FeatureGroup();

    // Initialise the draw control
    var drawControl = new L.Control.Draw({
        position: 'topleft',
        draw: {
            polyline: false,  //turn off
            polygon: false,
            circle: false,
            rectangle: {
                shapeOptions: {
                    clickable: false
                }
            },
            marker: false
        },
        edit: {
            featureGroup: drawnItems,
            edit: false,
            remove: false
        }
    });

    angular.extend($scope, {
                center: {
                    lat: 37.4104,
                    lng: -122.0598,
                    zoom: 16
                },
                controls: {
                  /*
                    draw: {
                      polyline: false,  //turn off
                      polygon: false,
                      circle: false,
                      rectangle: {
                          shapeOptions: {
                              color: '#bada55',
                              clickable: false
                          }
                      },
                      marker: false
                    }
                  */
                  custom: [drawControl]
                },
                layers: {
                    baselayers: {
                      xyz: {
                          name: 'OpenStreetMap (XYZ)',
                          url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                          type: 'xyz'
                      }
                    },
                    overlays: {
                      draw: {
                        name: 'draw',
                        type: 'group',
                        visible: true,
                        layerParams: {
                            showOnSelector: false
                        }
                      }
                    }
                },
                events: {},
                markers: {
                    enable: leafletMarkerEvents.getAvailableEvents(),
                }
            });

    //draw control+++
    leafletData.getMap().then(function(map) {
        leafletData.getLayers().then(function(baseLayers) {
            var drawItems = baseLayers.overlays.draw;
            map.on('draw:created', function(e) {
                var layer = e.layer;
                drawItems.addLayer(layer);
                //ngdialog test+++
                ngDialog.openConfirm({
                					template: 'modalDialogId',
                          scope: $scope,
                					className: 'ngdialog-theme-default'
                				}).then(function (value) {
                					console.log('Modal promise resolved. Value: ', value);
                          GroupMapService.StartGroupChat(value, selectUsers);

                				}, function (reason) {
                					console.log('Modal promise rejected. Reason: ', reason);
                          drawItems.removeLayer(layer);
                				});
                var geoObj = layer.toGeoJSON();
                //debugger
                var selectUsers = userInRange(geoObj.geometry.coordinates[0][2], geoObj.geometry.coordinates[0][4]);
                console.log("users: " + selectUsers);
                $scope.selected = selectUsers; //for test
                //ngdialog test---
                console.log(JSON.stringify(geoObj));
            });
        });
    });

    var userInRange = function(upperRight, bottomLeft) {
      //lng: bottomLeft[0], upperRight[0]
      //lat: bottomLeft[1], upperRight[1]
      //debugger
      userlist = [];
      for(var i = 0; i < $scope.markers.length; i++) {
        if($scope.markers[i].lat >= bottomLeft[1] &&
           $scope.markers[i].lat <= upperRight[1] &&
           $scope.markers[i].lng >= bottomLeft[0] &&
           $scope.markers[i].lng <= upperRight[0]) {
           userlist.push($scope.markers[i].title);
        }
      }
       return userlist;
    }
    //draw control---

    //$scope.markers = new Array(); //jshint warning
    $scope.markers = [];
    MarkerService.EditMarker.query().$promise.then(
        function(data){
            data.forEach(function(a) {
              //console.log(a);
              //add focus
              if (a.title == username) {
                curCord.lat = a.lat;
                curCord.lng = a.lng;
                a.focus = true;
                //for test
                //example : http://tombatossals.github.io/angular-leaflet-directive/examples/0000-viewer.html#/markers/angular-template-example
                //a.message = "<a href=\"http:\/\/www.w3schools.com\">Visit W3Schools.com!</a> "
              }
              var title = "'" + a.title + "'";
              a.message = '<a ui-sref="viewProfile({ targetUser: ' + title + '})"' + '>' + a.title + '</a>'

              $scope.markers.push(a);
            });
    });

    $scope.viewProfile = function(username) {
      debugger;
      $state.go("viewProfile", {targetUser: username});
    };


    $scope.$on("leafletDirectiveMap.click", function(event, args){
        var leafEvent = args.leafletEvent;
        //var username = AuthService.getUser().username;
        //remove first
        for(var i = $scope.markers.length - 1; i >= 0; i--) {
          if($scope.markers[i].title == username) {
             $scope.markers.splice(i, 1);
          }
        }

        MarkerService.RemoveMarker(username);

        var data = {
          lat: leafEvent.latlng.lat,
          lng: leafEvent.latlng.lng,
          // message: "My Added Marker"
          //
          //
          title: username,
          message: '<a ui-sref="viewProfile({ targetUser: ' + username + '})"' + '>' + username + '</a>'
        };
        console.log("data.title = " + data.title + ", data.message = " + data.message);
        curCord.lat = data.lat;
        curCord.lng = data.lng;
        MarkerService.EditMarker.save(data);
        $scope.markers.push(data);
    });

    $scope.slider = {
        value: 20,
        options: {
          floor: 0,
          ceil: 1000,
          step: 20,
          minLimit: 20,
          maxLimit: 1000/*,
          onEnd: function() {
                 calcBoundary(0);
          }*/
        }
    };

    //calc map bound
    Number.prototype.toRad = function() {
       return this * Math.PI / 180;
    }

    Number.prototype.toDeg = function() {
       return this * 180 / Math.PI;
    }

    var destinationPoint = function(lat, lng, brng, dist) {
       dist = dist / 6371;
       brng = brng.toRad();

       var lat1 = lat.toRad(), lon1 = lng.toRad();

       var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
                            Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

       var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                                    Math.cos(lat1),
                                    Math.cos(dist) - Math.sin(lat1) *
                                    Math.sin(lat2));

       if (isNaN(lat2) || isNaN(lon2)) return null;

       return [lat2.toDeg(), lon2.toDeg()];
    }

    var boundsArray = [];

    $scope.$on("slideEnded", function() {
        var newVal = $scope.slider.value;
        console.log("slider value = " + newVal);

        if (!isNaN(curCord.lat) && !isNaN(curCord.lng)) {
            boundsArray.length = 0; //clear
            boundsArray.push(destinationPoint(curCord.lat, curCord.lng, 225, newVal*0.001));  //southwest
            boundsArray.push(destinationPoint(curCord.lat, curCord.lng, 45, newVal*0.001));  //northeast
            console.log("boundsArray = " + boundsArray);

            var bounds = leafletBoundsHelpers.createBoundsFromArray(boundsArray);

            angular.extend($scope, {
                bounds: bounds,
                center: {lat: curCord.lat, lng: curCord.lng}
            });
        }
    });



  }]);
