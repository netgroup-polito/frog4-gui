/**
 * Created by giacomo on 02/05/16.
 */
(function () {
    'use strict';
    /**
     * The controller for the modal used to edit the graph basic info
     * @param $uibModalInstance The instance of the modal which load the controller
     * @param info The parameter defined into the dialog initialization
     */
    var updateFGInfoController = function ($uibModalInstance, info) {
        var ctrl = this;
        // the info variable extracted frm the parameter passed to the modal
        ctrl.info = {
            id: info.id,
            name: info.name,
            description: info.description
        };
        /**
         * Function used to undo all the modification and close the modal
         */
        ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        /**
         * Function used to save all the modification after modal is closed
         */
        ctrl.save = function (form) {
            if (form.$valid) {
                $uibModalInstance.close(ctrl.info);
            }
        };
    };

    updateFGInfoController.$inject = ['$uibModalInstance', 'info'];
    angular.module('fg-gui').controller('UpdateFGInfoController', updateFGInfoController);

})();