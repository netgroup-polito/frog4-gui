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

        var ctrl = this;
        ctrl.isArray = angular.isArray;
        var oldState;

        modelFunc(vnf.id).then(function (resultModel) {
            stateFunc(vnf.ports[0].mac, username).then(function (resultState) {
                oldState = clone(resultState.state);
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

        ctrl.showContent = function($fileContent){
            ctrl.state = JSON.parse($fileContent);
        };
    };
    vnfConfigModalController.$inject = ['$uibModalInstance', 'vnf', 'username', 'modelFunc', 'stateFunc'];
    //vnfConfigModalController.$inject = ['$uibModalInstance', 'model', 'state'];
    angular.module('d3').controller('ConfigVNFModalController', vnfConfigModalController);
})();