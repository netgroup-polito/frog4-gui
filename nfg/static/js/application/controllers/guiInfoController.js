/**
 * Created by giacomo on 18/11/16.
 */
(function () {
    'use strict';
    /**
     * The controller for the modal used to show gui info
     * @param $uibModalInstance The instance of the modal which load the controller
     */
    var guiInfoController = function ($uibModalInstance) {
        var ctrl = this;
        /**
         * Function used to undo all the modification and close the modal
         */
        ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };

    guiInfoController.$inject = ['$uibModalInstance'];
    angular.module('fg-gui').controller('GuiInfoController', guiInfoController);

})();