/**
 * Created by giacomo on 11/04/16.
 */
(function () {
    'use strict';

    var UserListController = function (BackendCallService, $uibModal, $dialogs) {
        var ctrl = this;
        ctrl.users = [];
        BackendCallService.getUsers().then(function (res) {
            ctrl.users = res.users;
        }, function (fail) {
            alert(JSON.stringify(fail));
        });

        ctrl.delete = function (user) {
            var confirm = $dialogs.confirm('Please Confirm', 'Do you want to delete the user "' + user.username + '"?');
            confirm.result.then(function () {
                BackendCallService.deleteUser(user).then(function () {
                    ctrl.users.splice(ctrl.users.indexOf(user), 1);
                });
            });
        };
        ctrl.update = function (user) {

        };
        ctrl.add = function () {
            var addModal = $uibModal.open({
                animation: false,
                templateUrl: '/static/pages/modals/newUserModal.html',
                controller: 'NewUserController',
                controllerAs: 'NewUserCtrl',
                size: 'lg'
            });
            addModal.result.then(
                function (newUser) {
                    ctrl.users.push(newUser);
                }
            )
        };
    };

    UserListController.$inject = ['BackendCallService', '$uibModal', 'dialogs'];
    angular.module('fg-gui').controller('UserListController', UserListController);

})();