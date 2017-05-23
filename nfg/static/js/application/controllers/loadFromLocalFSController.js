/**
 * Created by valentin on 17/09/16.
 */

(function () {
    'use strict';
    /**
     * Controller for the modal used to load a graph from the client
     * @param $uibModalInstance Instance of the modal used to load the controller.
     */
    var loadFromLocalFSController = function ($uibModalInstance) {
        var ctrl = this;
        // the selected Graph
        ctrl.selectedGraph = null;
        // control variable used to show the forwarding graph preview
        ctrl.showGraph = false;

        /**
         * function used to close the graph, without doing anything
         */
        ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        /**
         * function used to close the graph when a graph is choose
         */
        ctrl.load = function () {
            if (ctrl.selectedGraph)
                delete ctrl.selectedGraph['forwarding-graph']['id'];
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

    loadFromLocalFSController.$inject = ['$uibModalInstance'];
    angular.module('fg-gui').controller('LoadFromLocalController', loadFromLocalFSController);

})();

