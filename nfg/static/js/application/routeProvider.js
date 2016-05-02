/**
 * Created by giacomo on 08/04/16.
 */
(function () {
    "use strict";

    var applicationViewBasePath = '/static/pages/';
    //var applicationControllerBasePath = '/static/js/application/controller/';

    var RouteProvider = function ($routeProvider) {
        $routeProvider.when('/home', {
            redirectTo: "/"
        }).when('/users', {
            redirectTo: "/"
        }).when('/', {
            templateUrl: applicationViewBasePath + 'userList.html',
            controller: 'UserListController',
            controllerAs: 'UserListCtrl'
        }).when('/groups', {
            templateUrl: applicationViewBasePath + 'groupList.html',
            controller: 'GroupListController',
            controllerAs: 'GroupListCtrl'
        });
    };

    RouteProvider.$inject = ['$routeProvider'];

    angular.module("fg-gui").config(RouteProvider);
})();