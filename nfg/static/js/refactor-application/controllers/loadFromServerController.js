/**
 * Created by giacomo on 16/05/16.
 */
(function () {
    'use strict';

    var loadFromServerController = function ($uibModalInstance, BackendCallService) {
        var ctrl = this;
        ctrl.selectedGraph = null;
        ctrl.showGraph = false;

        BackendCallService.getAvailableGraphs().then(function (result) {
            ctrl.availableGraphs = result["NF-FG"];
            if (ctrl.availableGraphs.length > 0)
                ctrl.selectedGraph = ctrl.availableGraphs[0];
        });

        ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        ctrl.load = function () {
            $uibModalInstance.close(ctrl.selectedGraph);
        };
        ctrl.preview = function () {
            ctrl.showGraph = true;
        };
    };

    loadFromServerController.$inject = ['$uibModalInstance', 'BackendCallService'];
    angular.module('fg-gui').controller('LoadFromServerController', loadFromServerController);

})();
