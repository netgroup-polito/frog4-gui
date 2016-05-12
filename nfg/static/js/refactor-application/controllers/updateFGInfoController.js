/**
 * Created by giacomo on 02/05/16.
 */
(function () {
    'use strict';

    var updateFGInfoController = function ($uibModalInstance,info) {
        var ctrl = this;
        var info = {
            id: info.id,
            name: info.name,
            description: info.description
        };
        ctrl.info = info;

        ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        ctrl.save = function () {
            $uibModalInstance.close(ctrl.info);
        };
    };

    updateFGInfoController.$inject = ['$uibModalInstance', 'BackendCallService'];
    angular.module('fg-gui').controller('UpdateFGInfoController', updateFGInfoController);

})();