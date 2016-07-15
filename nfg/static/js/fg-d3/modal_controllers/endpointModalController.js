/**
 * Created by giacomo on 03/07/16.
 */
(function () {
    'use strict';
    /**
     * The controller for the modal used to add or edit an end-point
     * @param $uibModalInstance The instance of the modal which load the controller
     */
    var endpointModalController = function ($uibModalInstance) {
        var ctrl = this;
        /**
         * Function used to undo all the modification and close the modal
         */
        ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        /**
         * Function used to save all the modification after modal is closed
         */
        ctrl.save = function () {
            $uibModalInstance.close();
        };
    };

    endpointModalController.$inject = ['$uibModalInstance'];
    angular.module('d3').controller('EndpointModalController', endpointModalController);

})();