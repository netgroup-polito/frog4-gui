/**
 * Created by giacomo on 01/05/16.
 */
(function () {
    "use strict";

    var applicationViewBasePath = '/static/pages/refactor/';
    //var applicationControllerBasePath = '/static/js/application/controller/';

    var RouteProvider = function ($routeProvider) {
        $routeProvider.when('/home', {
            redirectTo: "/"
        }).when('/nf-fg', {
            redirectTo: "/"
        }).when('/', {
            templateUrl: applicationViewBasePath + 'nf-fg.html',
            controller: 'NFFGController',
            controllerAs: 'NFFGCtrl'
        });
    };

    RouteProvider.$inject = ['$routeProvider'];

    angular.module("fg-gui").config(RouteProvider);
})();