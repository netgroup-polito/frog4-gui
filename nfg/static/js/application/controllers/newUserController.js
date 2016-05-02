/**
 * Created by giacomo on 29/04/16.
 */
(function () {
    'use strict';
    var NewUserController = function ($uibModalInstance, BackendCallService) {
        var ctrl = this;
        ctrl.availableGroups = [];

        BackendCallService.getGroups().then(function (result) {
            ctrl.availableGroups = result.groups;
        });

        this.create = function () {
            BackendCallService.addUser(ctrl.newUser).then(
                function () {
                    $uibModalInstance.close({username: ctrl.newUser.username, group: ctrl.newUser.group});
                },
                function (error) {
                    if (error && error.error)
                        alert(JSON.stringify(error.error));
                    else
                        alert("An Unexpected Error Occured");
                }
            );
        };
        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        ctrl.newUser = {
            username: "",
            password: "",
            confirmPassword: "",
            group: ""
        }

    };
    NewUserController.$inject = ['$uibModalInstance', 'BackendCallService'];
    angular.module("fg-gui").controller("NewUserController", NewUserController);
})();