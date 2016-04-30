/**
 * Created by giacomo on 29/04/16.
 */
(function () {
    'use strict';

    var GroupListController = function (BackendCallService, $uibModal, $dialogs) {
        var ctrl = this;
        ctrl.groups = [];
        BackendCallService.getGroups().then(function (res) {
            ctrl.groups = res.groups;
        }, function (fail) {
            alert(JSON.stringify(fail));
        });

        ctrl.delete = function (group) {
            var confirm = $dialogs.confirm('Please Confirm', 'Do you want to delete the group "' + group.name + '"');
            confirm.result.then(function () {
                BackendCallService.deleteGroup(group).then(function () {
                    ctrl.groups.splice(ctrl.groups.indexOf(group), 1);
                });
            });
        };
        ctrl.update = function (user) {
            //not implemented
        };
        ctrl.add = function () {
            var addModal = $uibModal.open({
                animation: false,
                templateUrl: '/static/pages/modals/newGroupModal.html',
                controller: 'NewGroupController',
                controllerAs: 'NewGroupCtrl',
                size: 'lg'
            });
            addModal.result.then(
                function (newGroup) {
                    ctrl.groups.push(newGroup);
                }
            )
        };
    };

    GroupListController.$inject = ['BackendCallService', '$uibModal', 'dialogs'];
    angular.module('fg-gui').controller('GroupListController', GroupListController);

})();