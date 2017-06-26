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

        modelFunc(graphId, vnf.id, tenantId, vnf.vnf_template)
            .then(function (resultModel) {
            stateFunc(graphId, vnf.id, tenantId)
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
                //here I remove empty fields from the JSON object
                function removeEmptyFields(node){
                    for(var element in node){
                        if(node[element] == ""){
                            delete node[element];
                        }
                        else if( !(typeof node[element] === "string" ||
                                   typeof node[element] === "number" ||
                                   typeof node[element] === "boolean" ||
                                   node[element] == undefined) ){
                            removeEmptyFields(node[element]);
                        }
                    }
                }
                //here I check if the state is empty -> to fix
                for (var prop in ctrl.state) {
                    if (prop == ":") {
                        delete ctrl.state[prop];
                    }
                    removeEmptyFields(ctrl.state[prop]);
                }

                var res = {
                    newState: ctrl.state,
                    graphId: graphId,
                    vnfIdentifier: vnf.id
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
