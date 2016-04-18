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
                controller: 'userListController'/*,
                resolve: {
					loginControllHandler : controllIfLoggin
				}*/

			});
	};

	RouteProvider.$inject = ['$routeProvider'];

	angular.module("fg-gui").config(RouteProvider);

	/*function controllIfLoggin(sharedProperties) {
		WL.Logger.info("(navigation)controllIfLoggin");
		var mainScope = angular.element($("#mainContainer")).scope();
		if(sharedProperties.isLoginOk() == false) {
			mainScope.redirectToLogin();
		}
	};*/
})();