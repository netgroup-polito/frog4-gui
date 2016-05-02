/**
 * Created by giacomo on 02/05/16.
 */
(function () {
    'use strict';

    var updateFGInfoController = function ($uibModalInstance, BackendCallService) {
        var ctrl = this;
        var info = {
            id:"",
            name:"",
            description:""
        };

        ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        ctrl.save = function () {
             $uibModalInstance.close(info);
        };
    };

    updateFGInfoController.$inject = ['$uibModalInstance', 'BackendCallService'];
    angular.module('fg-gui').controller('updateFGInfoController', updateFGInfoController);

})();