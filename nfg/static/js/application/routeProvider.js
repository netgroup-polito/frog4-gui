/**
 * Created by giacomo on 08/04/16.
 */
(function(){
    "use strict";

	var applicationViewBasePath = '/static/pages/';
	//var applicationControllerBasePath = '/static/js/application/controller/';

	var RouteProvider = function($routeProvider) {
		$routeProvider.
			when('/home', {
                redirectTo:"/"
			}).
			when('/', {
                templateUrl: applicationViewBasePath + 'userList.html',
                controller: 'UserListController',
				controllerAs: 'UserListCtrl'
			});
	};

	RouteProvider.$inject = ['$routeProvider'];

	angular.module("fg-gui").config(RouteProvider);
})();