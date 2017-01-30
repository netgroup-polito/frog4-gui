/**
 * Created by riccardodiomedi on 23/09/16.
 */
(function () {
    'use strict';

    /**
     * These two functions need to handle the augment obj of a yang model
     * @param augment
     */
    var parseAugment = function (augment) {
        augment['@target-node'] = augment['@target-node'].split("/").slice(1);
        var toRet = pathToObj(augment['@target-node'], augment['@target-node'].length, augment);
        return toRet;
    };
    var pathToObj = function (array, length, aug) {
        if (array.length > 1) {
            //GO DEEP
            var objj = {};
            objj[array[0]] = pathToObj(array.slice(1), length, aug);
            return objj;
        } else if (array.length == 1) {
            var obj = {};
            delete aug['@target-node'];
            aug.when['@condition'] = aug.when['@condition'].replace(/[']/g, "");
            obj[array[0]] = aug;
            return obj;
        }
    };

    /**
     * Modal controller in order to configure the VNF
     * @param $uibModalInstance
     * @param vnf
     * @param graphId
     * @param tenantId
     * @param modelFunc
     * @param stateFunc
     */
    var vnfConfigModalController = function ($uibModalInstance, vnf, graphId,  tenantId, modelFunc, stateFunc) {

        var ctrl = this;
        ctrl.isArray = angular.isArray;
        var oldState;

        //TODO: substitute with vnf identifier according with francesco
        modelFunc(graphId, vnf.ports[0].mac, tenantId, vnf.vnf_template)
            .then(function (resultModel) {
            stateFunc(graphId, vnf.ports[0].mac, tenantId)
                .then(function (resultState) {
                oldState = clone(resultState.state);
                ctrl.state = resultState.state;
                ctrl.model = resultModel.model;

                if (resultModel.model.augment) {
                    ctrl.augment = parseAugment(resultModel.model.augment);
                    console.log("augment", ctrl.augment);
                }

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

                if (resultModel.model.augment) {
                    ctrl.augment = parseAugment(resultModel.model.augment);
                    console.log("augment", ctrl.augment);
                }

            });
        }, function (error) {
           console.log(error);
        });

        ctrl.ok = function () {

            //passare l'oggetto con stato attuale, mac address e tenantId
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
                    graphId: graphId,
                    vnfIdentifier: vnf.ports[0].mac,//TODO: sobstitute with vnf identifier according with francesco
                    tenantId: tenantId
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
    vnfConfigModalController.$inject = ['$uibModalInstance', 'vnf', 'graphId',  'tenantId', 'modelFunc', 'stateFunc'];
    //vnfConfigModalController.$inject = ['$uibModalInstance', 'model', 'state'];
    angular.module('d3').controller('ConfigVNFModalController', vnfConfigModalController);
})();