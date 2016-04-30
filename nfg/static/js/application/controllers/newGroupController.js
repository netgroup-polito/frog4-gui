/**
 * Created by giacomo on 29/04/16.
 */
(function () {
    'use strict';
    var NewGroupController = function ($uibModalInstance, BackendCallService) {
        var ctrl = this;

        this.create = function () {
            BackendCallService.addGroup(ctrl.newGroup).then(
                function (result) {
                    $uibModalInstance.close(ctrl.newGroup);
                },
                function (error) {
                    if (error && error.error)
                        alert(JSON.stringify(error.error));
                    else
                        alert("An Unexpected Error Occured");
                });

        };
        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        ctrl.newGroup = {
            name: ""
        }

    };
    NewGroupController.$inject = ['$uibModalInstance', 'BackendCallService'];
    angular.module("fg-gui").controller("NewGroupController", NewGroupController);
})();