/**
 * Created by giacomo on 01/05/16.
 */
(function () {
    "use strict";

    var applicationViewBasePath = '/static/pages/';
    //var applicationControllerBasePath = '/static/js/application/controller/';

    /**
     * Definition of the route for the application, at each view is associated a controller, and a template for the ng-view directive
     * @param $routeProvider
     * @constructor
     */
    var RouteProvider = function ($routeProvider/*,$locationProvider*/) {
        $routeProvider.when('/home', {
            redirectTo: "/"
        }).when('/nf-fg', {
            redirectTo: "/"
        }).when('/vnf-repository', { // VNF Repository View
            templateUrl: applicationViewBasePath + 'vnf-repository.html',
            controller: 'VNFRepoController',
            controllerAs: 'VNFRepoCtrl'
        }).when('/', { // Forwarding-graph View
            templateUrl: applicationViewBasePath + 'nf-fg.html',
            controller: 'NFFGController',
            controllerAs: 'NFFGCtrl',
            hotkeys: [
                ['del', 'Delete the currently selected element', 'NFFGCtrl.deleteSelected()'],
                ['esc', 'Deselect the currently selected element', 'NFFGCtrl.deselectSelected()']
            ]
        }).when('/users', {
            templateUrl: applicationViewBasePath + 'userList.html',
            controller: 'UserListController',
            controllerAs: 'UserListCtrl'
        }).when('/groups', {
            templateUrl: applicationViewBasePath + 'groupList.html',
            controller: 'GroupListController',
            controllerAs: 'GroupListCtrl'
        });
        //$locationProvider.html5Mode(true);
    };

    RouteProvider.$inject = ['$routeProvider'/*,'$locationProvider'*/];

    angular.module("fg-gui").config(RouteProvider);
})();
