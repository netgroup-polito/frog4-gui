/**
 * Created by riccardodiomedi on 23/09/16.
 */
(function () {
    'use strict';
    /**
     * Modal controller in order to configure the VNF
     * @param $uibModalInstance
     * @param model
     * @param state
     */
    var vnfConfigModalController = function ($uibModalInstance, model, state) {
        var ctrl = this;
        //in order to have the 'isArray' function of angular within the template
        ctrl.isArray = angular.isArray;

        //i need to copy the state in order to modify a copy of it and not the original
        ctrl.model = model;
        ctrl.state = state;

        ctrl.ok = function () {
            console.log("ok", ctrl.state);
            $uibModalInstance.close(ctrl.state);
        };
        ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        //i need this function in order to parse the external containers
        //val: name of the external container

        //i don't know if it's more correct to use model or ctrl.model (the same for state)
        ctrl.myFunction = function (val) {
            var nameExternalContainer = model['@name'] + ":" + val; //accrocchio
            return state[nameExternalContainer];
        };
    };
    vnfConfigModalController.$inject = ['$uibModalInstance', 'model', 'state'];
    angular.module('d3').controller('ConfigVNFModalController', vnfConfigModalController);
})();