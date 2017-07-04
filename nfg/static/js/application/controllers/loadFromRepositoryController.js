/**
 * Created by luigi on 05/01/17.
 */
(function () {
    'use strict';
    /**
     * Controller for the modal used to load a graph from the repository
     * @param $uibModalInstance Instance of the modal used to load the controller.
     * @param BackendCallService Service used to make call to the backend
     */
    var loadFromRepositoryController = function ($uibModalInstance, BackendCallService) {
        var ctrl = this;
        // all the available graphs on repository
        ctrl.availableGraphs = [];
        // the selected graph
        ctrl.selectedGraph = null;
        // control variable used to show the forwarding graph preview
        ctrl.showGraph = false;

        /**
         * Get all available graph
         */
        BackendCallService.getAvailableGraphsFromRepo().then(function (result) {
            ctrl.availableGraphs = result["graphs"];
            if (ctrl.availableGraphs.length > 0)
                ctrl.selectedGraph = ctrl.availableGraphs[0];
                delete ctrl.selectedGraph['forwarding-graph']['id'];
        });

        /**
         * function used to get all available graphs again
         */
        ctrl.reload = function () {
            BackendCallService.getAvailableGraphsFromRepo().then(function (result) {
                ctrl.availableGraphs = result["graphs"];
                if (ctrl.availableGraphs.length > 0)
                    ctrl.selectedGraph = ctrl.availableGraphs[0];
                    delete ctrl.selectedGraph['forwarding-graph']['id'];
            });
        };
        /**
         * function used to close the modal, without doing anything
         */
        ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        /**
         * function used to close the modal when a graph is choose
         */
        ctrl.load = function () {
            if (ctrl.selectedGraph)
                $uibModalInstance.close(ctrl.selectedGraph);
        };
        /**
         * Function to enable the preview mode
         */
        ctrl.preview = function () {
            delete ctrl.selectedGraph['forwarding-graph']['id'];
            ctrl.showGraph = true;
        };
    };

    loadFromRepositoryController.$inject = ['$uibModalInstance', 'BackendCallService'];
    angular.module('fg-gui').controller('LoadFromRepositoryController', loadFromRepositoryController);

})();

