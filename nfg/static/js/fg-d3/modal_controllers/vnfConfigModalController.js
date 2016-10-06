/**
 * Created by riccardodiomedi on 23/09/16.
 */
(function () {
    'use strict';
    /**
     * Modal controller in order to configure the VNF
     * @param $uibModalInstance
     * @param type
     * @param mac
     * @param username
     * @param modelFunc
     * @param stateFunc
     */

    var vnfConfigModalController = function ($uibModalInstance, type, mac, username, modelFunc, stateFunc) {
        //passare tutto l'oggetto
    //var vnfConfigModalController = function ($uibModalInstance, model, state) {
        var ctrl = this;
        //in order to have the 'isArray' function of angular within the template
        ctrl.isArray = angular.isArray;
        var oldState;

        modelFunc(type).then(function (resultModel) {
            stateFunc(mac, username).then(function (resultState) {
                oldState = clone(resultState.state);
                //gestione delle ifEntry su resultState
                ctrl.state = resultState.state;
                ctrl.model = resultModel.model;

                console.log(ctrl.model);
                console.log(ctrl.state);

            }, function (error) {
                ctrl.model = resultModel.model;
                console.log(error);
            });
        }, function (error) {
           console.log(error);
        });

        //ctrl.model = model;
        //ctrl.state = state;

        ctrl.ok = function () {
            //passare l'oggetto con tutto
            console.log("ok", ctrl.state);
            if (angular.equals(oldState, ctrl.state)) {
                $uibModalInstance.dismiss('equal states');
            } else {
                $uibModalInstance.close(ctrl.state);
            }
        };
        ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        //i need this function in order to parse the external containers
        //val: name of the external container
        ctrl.myFunction = function (val) {
            var nameExternalContainer = ctrl.model['@name'] + ":" + val; //accrocchio
            if (typeof(ctrl.state[nameExternalContainer]) == 'undefined') {
                ctrl.state[nameExternalContainer] = {};
            }
            return ctrl.state[nameExternalContainer];
        };

        ctrl.showContent = function($fileContent){
            ctrl.state = JSON.parse($fileContent);
        };
    };
    vnfConfigModalController.$inject = ['$uibModalInstance', 'type', 'mac', 'username', 'modelFunc', 'stateFunc'];
    //vnfConfigModalController.$inject = ['$uibModalInstance', 'model', 'state'];
    angular.module('d3').controller('ConfigVNFModalController', vnfConfigModalController);
})();