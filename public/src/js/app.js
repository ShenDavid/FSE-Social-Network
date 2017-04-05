var esnApp = angular.module('esnApp', ['ngAnimate', 'ui.bootstrap', 'ngSanitize', 'ui.router', 'ngStorage', 'ngResource', 'btford.socket-io', 'ui-notification', 'ngFileUpload', 'leaflet-directive', 'rzModule', 'ngDialog']);
esnApp.config(function($stateProvider, $urlRouterProvider, NotificationProvider) {

    $urlRouterProvider.otherwise('/home');


    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'src/views/partials/home.html',
            controller: 'HomeCtrl',
            authenticate: false,
            params: {
                newuser: null
            }
        })
    // CHAT PAGE AND MULTIPLE NAMED VIEWS =================================
    .state('chat', {
            url: '/chat',
            templateUrl: 'src/views/partials/chat.html',
            controller: 'PublicChatCtrl',
            authenticate: true
        })
        .state('privateChat', {
            url: '/privateChat',
            templateUrl: 'src/views/partials/privateChat.html',
            controller: 'PrivateChatCtrl',
            authenticate: true,
            params: {
                target: null
            }
        })
        .state('searchInfo', {
            url: '/searchInfo',
            templateUrl: 'src/views/partials/searchInfo.html',
            controller: 'SearchInformationCtrl',
            authenticate: true,
            resolve: {
                stopwords: function($stateParams, SearchInfoService) {
                    return SearchInfoService.getStopWords();
                }
            }
        })
        .state('mails', {
            url: '/mails',
            templateUrl: 'src/views/partials/mail.html',
            controller: 'MailCtrl',
            authenticate: true,
            params: {
                target: null
            }
        })
        .state('users', {
            url: '/users',
            templateUrl: 'src/views/partials/users.html',
            controller: 'UserCtrl',
            authenticate: true
        })
        .state('map', {
            url: '/map',
            templateUrl: 'src/views/partials/map.html',
            controller: 'MapCtrl',
            authenticate: true
        })
        .state('groupin', {
            url: '/groupin',
            templateUrl: 'src/views/partials/groupin.html',
            controller: 'GroupInCtrl',
            authenticate: true
        })
        .state('groupchat', {
            url: '/groupchat',
            templateUrl: 'src/views/partials/groupchat.html',
            controller: 'GroupChatCtrl',
            authenticate: true
        })
        .state('login', {
            url: '/login',
            templateUrl: 'src/views/partials/login.html',
            controller: 'LoginCtrl',
            // controllerAs: '$LoginCtrl',
            authenticate: false,
            resolve: {
                blacklist: function($stateParams, BlacklistService) {
                    return BlacklistService.get();
                }
            }
        })

        .state('editProfile', {
            url: '/editProfile',
            templateUrl: 'src/views/partials/editProfile.html',
            controller: 'ProfileController',
            authenticate: true,

        })
        .state('viewProfile', {
          url: '/viewProfile',
          templateUrl: 'src/views/partials/viewProfile.html',
          controller: 'ProfileController',
          authenticate: true,
          params: {
            targetUser: null
          }
        })
        .state('error', {
          url: '/error',
          templateUrl: 'src/views/partials/error.html',
          controller: 'ErrorController',
          authenticate: false,
          params: {
            errormessage: null
          }
        })


    //private message alert style configuration
    NotificationProvider.setOptions({
        delay: null, //ms before fade out //non-integer: keep until killed
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'right',
        positionY: 'bottom'
    });
});

esnApp.run(function($rootScope, $state, AuthService) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate && !AuthService.isAuthenticated()) {
            // User isn’t authenticated
            $state.transitionTo("login");
            event.preventDefault();
        }
    });

});


esnApp.filter('searchFor', function(){
    return function(arr, searchString){
        if(!searchString){
            return arr;
        }
        var result = [];
        searchString = searchString.toLowerCase();
        angular.forEach(arr, function(item){
            if(item.profile.name.toLowerCase().indexOf(searchString) !== -1){
            result.push(item);
        }
        });
        return result;
    };
});

esnApp.constant('AUTH_EVENTS', {
    registerSuccess: 'auth-register-success',
    registerFailed: 'auth-register-failed',
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized',
    userNotFound: 'auth-not-username',
    profileCreated: 'auth-profile-created'
});
