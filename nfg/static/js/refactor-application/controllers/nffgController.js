/**
 * Created by giacomo on 01/05/16.
 */
(function () {
    'use strict';

    var NFFGController = function (BackendCallService,$uibModal) {
        var ctrl = this;

        ctrl.showEditButton = false;
        ctrl.fg = null;

        ctrl.toggleEditButton = function () {
            ctrl.showEditButton = !ctrl.showEditButton;
        };
        
        ctrl.updateFGInfo = function () {
            var updateInfoModal = $uibModal.open({
                animation: false,
                templateUrl: '/static/pages/refactor/modals/newUserModal.html',
                controller: 'UpdateFGInfoController',
                controllerAs: 'UpdateFGInfoCtrl',
                size: 'lg'
            });
            updateInfoModal.result.then(function (res) {
                
            })
        }

    };

    NFFGController.$inject = ['BackendCallService','$uibModal'];
    angular.module('fg-gui').controller('NFFGController', NFFGController);

})();