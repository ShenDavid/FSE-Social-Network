/**
 * Author: PZ
 * Name: SearchInformationCtrl
 * Assumption: The Citizen is logged into the system.
 * Description: The use case allows the Citizen to search for any information stored in the system.
 */
'use strict';
angular.module('esnApp').controller('SearchInformationCtrl', function($scope, SearchInfoService, stopwords) {
    $scope.stopwords = stopwords;
    $scope.searchIsTrigerred = false;
    //$scope.searchType == '';
    $scope.searchType = '';

    $scope.citizenQuery = "";
    $scope.annoucementQuery = "";
    $scope.messageQuery = "";

    $scope.cache = [];

    $scope.loadCount = 0;

    $scope.CitizenSearchType = {
        type: "username"
    };

    $scope.MessageSearchType = {
        type: "public"
    };

    $scope.users = [];

    $scope.maxCount = 0;
    $scope.loadCount = 0;
    $scope.cacheItems = function(items) {
        $scope.maxCount = Math.floor(items.length / 10);
        $scope.loadCount = $scope.maxCount;
        $scope.cache = items;
        //debugger;
    };

    $scope.getCacheItems = function() {
        if ($scope.loadCount === 0) {
            $scope.result = $scope.cache;
            return $scope.cache;
        } else {
            $scope.result = $scope.cache.slice(0, 10 * ($scope.maxCount - $scope.loadCount + 1));
            $scope.loadCount--;
            return $scope.result;
        }
    };

    $scope.fetchMoreItems = function() {
        switch ($scope.searchType) {
            case "USER":
                $scope.users = $scope.getCacheItems();
                break;
            case "ANNOUNCEMENTS":
                $scope.announcements = $scope.getCacheItems();
                break;
            case "MESSAGES":
                $scope.msgs = $scope.getCacheItems();
                break;
            default:
                break;
        }
    };

    $scope.searchCitizen = function() {
        $scope.searchIsTrigerred = true;
        $scope.searchType = 'USER';

        if ($scope.CitizenSearchType.type === "username") {
            SearchInfoService.getCitizenByUsername($scope.citizenQuery).then(function(users) {
                $scope.cacheItems(users);
                $scope.users = $scope.getCacheItems();
                $scope.citizenQuery = "";

            }, function(err) {

            });
        } else if ($scope.CitizenSearchType.type === "statusCode") {
            SearchInfoService.getCitizenByStatusCode($scope.citizenQuery).then(function(users) {
                $scope.cacheItems(users);
                $scope.users = $scope.getCacheItems();
                $scope.citizenQuery = "";

            }, function(err) {

            });
        }

    };

    $scope.searchAnnouncements = function() {
        $scope.searchIsTrigerred = true;
        $scope.searchType = 'ANNOUNCEMENTS';

        var wordList = $scope.annoucementQuery.split(/[^a-zA-Z0-9]+/);
        var validQuery = [];
        wordList.forEach(function(word) {
            if (stopwords.indexOf(word) === -1) {
                validQuery.push(word);
            }
        });

        SearchInfoService.getAnnouncement(validQuery).then(function(announcements) {
            $scope.cacheItems(announcements);
            $scope.announcements = $scope.getCacheItems();
            $scope.annoucementQuery = "";

        }, function(err) {

        });

    };
    $scope.msgs = [];
    $scope.searchMessages = function() {
        $scope.searchIsTrigerred = true;
        $scope.searchType = 'MESSAGES';


        var wordList = $scope.messageQuery.split(/[^a-zA-Z0-9]+/);
        var validQuery = [];
        wordList.forEach(function(word) {
            if (stopwords.indexOf(word) === -1) {
                validQuery.push(word);
            }
        });

        if ($scope.MessageSearchType.type === "public") {
            SearchInfoService.getPublicMessages(validQuery).then(function(messages) {
                $scope.cacheItems(messages);
                $scope.msgs = $scope.getCacheItems();
                $scope.messageQuery = "";

            }, function(err) {

            });
        } else if ($scope.MessageSearchType.type === "private") {
            SearchInfoService.getPrivateMessages(validQuery).then(function(messages) {
                $scope.cacheItems(messages);
                $scope.msgs = $scope.getCacheItems();
                $scope.messageQuery = "";

            }, function(err) {

            });
        }

    };

});
