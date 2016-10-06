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

    var vnfConfigModalController = function ($uibModalInstance, vnf, username, modelFunc, stateFunc) {
        //passare tutto l'oggetto
    //var vnfConfigModalController = function ($uibModalInstance, model, state) {
        var ctrl = this;
        //in order to have the 'isArray' function of angular within the template
        ctrl.isArray = angular.isArray;
        var oldState;

        modelFunc(vnf.id).then(function (resultModel) {
            stateFunc(vnf.ports[0].mac, username).then(function (resultState) {
                oldState = clone(resultState.state);
                //gestione delle ifEntry su resultState
                ctrl.state = resultState.state;
                ctrl.model = resultModel.model;

                console.log(ctrl.model);
                console.log(ctrl.state);

            }, function (error) {
                console.log(error);
                ctrl.model = resultModel.model;

                //gestisco qui le ifEntry dell'interfaces
                var nameContainer = ctrl.model['@name'] + ':interfaces';
                ctrl.state[nameContainer] = {};
                ctrl.state[nameContainer]['ifEntry'] = [];
                for (var i = 0; i < vnf.ports.length; i++) {
                    var obj = {};
                    obj['name'] = 'eth' + i;
                    ctrl.state[nameContainer]['ifEntry'].push(obj);
                }

                console.log(ctrl.state);
            });
        }, function (error) {
           console.log(error);
        });

        //ctrl.model = model;
        //ctrl.state = state;

        ctrl.ok = function () {

            console.log("ok", ctrl.state);
            //passare l'oggetto con stato attuale, mac address e username
            if (angular.equals(oldState, ctrl.state)) {
                $uibModalInstance.dismiss('equal states');
            } else {
                //mettere il controllo sullo stato vuoto
                //to fix
                for (var prop in ctrl.state) {
                    if (prop == ":") {
                        delete ctrl.state[prop];
                    }
                }
                var res = {
                    newState: ctrl.state,
                    macAdd: vnf.ports[0].mac,
                    username: username
                };
                $uibModalInstance.close(res);
            }
        };
        ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        //i need this function in order to parse the external containers
        //val: name of the external container
        /*
        ctrl.myFunction = function (val) {
            var nameExternalContainer = ctrl.model['@name'] + ":" + val; //accrocchio
            if (typeof(ctrl.state[nameExternalContainer]) == 'undefined') {
                ctrl.state[nameExternalContainer] = {};
            }
            return ctrl.state[nameExternalContainer];
        };
        */

        ctrl.showContent = function($fileContent){
            ctrl.state = JSON.parse($fileContent);
        };
    };
    vnfConfigModalController.$inject = ['$uibModalInstance', 'vnf', 'username', 'modelFunc', 'stateFunc'];
    //vnfConfigModalController.$inject = ['$uibModalInstance', 'model', 'state'];
    angular.module('d3').controller('ConfigVNFModalController', vnfConfigModalController);
})();