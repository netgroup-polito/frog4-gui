/**
 * Created by giacomo on 11/04/16.
 */
(function () {
    'use strict';

    var UserListController = function (BackendCallService) {
        var groupList;
        BackendCallService.getUsers().then(function (res) {
            groupList = res;
        }, function (fail) {
            alert(JSON.stringify(fail));
        })
    };

    UserListController.$inject = ['BackendCallService'];
    angular.module('fg-gui').controller('UserListController', UserListController);

})();