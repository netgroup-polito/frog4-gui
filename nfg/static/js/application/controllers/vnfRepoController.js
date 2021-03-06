/**
 * Created by luigi on 17/11/16.
 */
(function () {
    'use strict';

    var VNFRepoController = function (BackendCallService, $uibModal, $dialogs) {
        var ctrl = this;
        ctrl.vnfs = [];
        BackendCallService.getVNFList().then(function (res) {
            ctrl.vnfs = res.templates;
        }, function (fail) {
            console.error(JSON.stringify(fail));
        });

        ctrl.delete = function (vnf) {
            var confirm = $dialogs.confirm('Deleting NF', 'The NF with ID "' + vnf.id + '" will be deleted. Are you sure?');
            confirm.result.then(function () {
                BackendCallService.deleteVNF(vnf.id).then(function () {
                    ctrl.vnfs.splice(ctrl.vnfs.indexOf(vnf), 1);
                }, function (fail) {
                    console.error(JSON.stringify(fail));
                });
            });
        };
        ctrl.update = function (vnf) {
            var editModal = $uibModal.open({
                animation: false,
                templateUrl: '/static/pages/modals/editVNFModal.html',
                controller: 'EditVNFController',
                controllerAs: 'EditVNFCtrl',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    currentVNF: function() {
                        return vnf;
                    }
                }
            });
            editModal.result.then(
                function (updatedVNF) {
                    ctrl.vnfs.splice(ctrl.vnfs.indexOf(vnf), 1, updatedVNF);
                }
            )
        };
        ctrl.add = function () {
            var addModal = $uibModal.open({
                animation: false,
                templateUrl: '/static/pages/modals/newVNFModal.html',
                controller: 'NewVNFController',
                controllerAs: 'NewVNFCtrl',
                size: 'lg',
                backdrop: 'static',
                keyboard: false
            });
            addModal.result.then(
                function (newVNF) {
                    ctrl.vnfs.push(newVNF);
                }
            )
        };
    };

    VNFRepoController.$inject = ['BackendCallService', '$uibModal', 'dialogs'];
    angular.module('fg-gui').controller('VNFRepoController', VNFRepoController);

})();
