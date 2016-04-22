/**
 * Created by giacomo on 18/04/16.
 */
(function () {
    'use strict';

    var UserListItemDirective = function () {
        return {
            templateUrl: '/static/js/application/directives/templates/userListItemTemplate.html'
        };
    };

    UserListItemDirective.$inject = [];
    angular.module('fg-gui').directive('userListItem', UserListItemDirective);
})();