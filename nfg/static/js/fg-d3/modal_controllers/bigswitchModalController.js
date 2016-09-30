/**
 * Created by giacomo on 19/09/16.
 */
(function () {
    'use strict';
    /**
     * The controller for the modal used to add an end-point
     * @param $uibModalInstance The instance of the modal which load the controller
     * @param fg
     * @param fgPos
     * @param schema
     * @param config
     * @param editFlowRulesModal
     */
    var bigSwitchModalController = function ($uibModalInstance, fg, fgPos, schema, config, editFlowRulesModal) {
        var ctrl = this;

        ctrl.flowRules = fg['flow-rules'];
        ctrl.flowRulesPos = fgPos['flow-rules'];

        config().then(function (res) {
            ctrl.config = res;
            angular.forEach(ctrl.config, function (elem) {
                if (!ctrl.existValue(elem)) {
                    var index = ctrl.config.indexOf(elem);
                    ctrl.config.splice(index, 1);
                }
            });
        });

        /**
         *
         * @param rule
         * @param key
         */
        ctrl.getValue = function (rule, key) {
            var splitted = key.split(':');
            var value = rule;
            for (var i = 0; i < splitted.length; i++) {
                if ($.isArray(value)) {
                    var count = 0;

                    for (var j = 0; j < value.length; j++) {
                        if (value[j][splitted[i]]) {
                            if (count < 1)
                                value = value[j][splitted[i]];
                            count++;
                        }
                    }
                    if (count > 1) {
                        value = 'Multiple Values';
                        break;
                    } else if (count == 0) {
                        value = '-';
                        break;
                    }
                } else {
                    if (value[splitted[i]]) {
                        value = value[splitted[i]];
                    } else {
                        value = '-';
                    }
                }
            }
            return value;
        };

        ctrl.existValue = function (key) {
            for (var i = 0; i < ctrl.flowRules.length; i++) {
                if (ctrl.getValue(ctrl.flowRules[i], key) != '-')
                    return true;
            }
            return false;
        };

        ctrl.editRule = function (rule) {
            var modal = editFlowRulesModal(rule, schema);
            modal.result.then(function (result) {
                var elem = result.elem;
                for(var i = 0; i < ctrl.flowRules.length; i++){
                    if(ctrl.flowRules[i].id == elem.id){
                        ctrl.flowRules[i] = elem;
                        break;
                    }
                }
            });
        };

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
            //validazione e controllo
            $uibModalInstance.close({rules: ctrl.flowRules});
        };
    };
    bigSwitchModalController.$inject = ['$uibModalInstance', 'fg', 'fgPos', 'schema', 'config', 'editFlowRulesModal'];
    angular.module('d3').controller('BigSwitchModalController', bigSwitchModalController);

})();