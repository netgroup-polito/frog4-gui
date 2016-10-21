/**
 * Created by giacomo on 01/05/16.
 */
(function () {
    "use strict";

    var applicationViewBasePath = '/static/pages/refactor/';
    //var applicationControllerBasePath = '/static/js/application/controller/';

    /**
     * Definition of the route for the application, at each view is associated a controller, and a template for the ng-view directive
     * @param $routeProvider
     * @constructor
     */
    var RouteProvider = function ($routeProvider) {
        $routeProvider.when('/home', {
            redirectTo: "/"
        }).when('/nf-fg', {
            redirectTo: "/"
        }).when('/vnf-repository', { // VNF Repository View
            templateUrl: applicationViewBasePath + 'vnf-repository.html'
            //controller: 'VNFRepController',
            //controllerAs: 'VNFRepCtrl'
        }).when('/', { // Forwarding-graph View
            templateUrl: applicationViewBasePath + 'nf-fg.html',
            controller: 'NFFGController',
            controllerAs: 'NFFGCtrl'
        });
    };

    RouteProvider.$inject = ['$routeProvider'];

    angular.module("fg-gui").config(RouteProvider);
})();
