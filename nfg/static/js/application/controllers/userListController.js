/**
 * Created by giacomo on 11/04/16.
 */
(function () {
    'use strict';

    var UserListController = function (BackendCallService, $modal) {
        var ctrl = this;
        ctrl.users = [];
        BackendCallService.getUsers().then(function (res) {
            ctrl.users = res.users;
        }, function (fail) {
            alert(JSON.stringify(fail));
        });

        ctrl.delete = function (user) {
            //$modal
        };
        ctrl.update = function (user) {

        }
    };

    UserListController.$inject = ['BackendCallService', '$uibModal'];
    angular.module('fg-gui').controller('UserListController', UserListController);

})();