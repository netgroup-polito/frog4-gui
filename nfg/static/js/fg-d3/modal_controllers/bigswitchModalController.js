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
        ctrl.save = function (form) {
            //validazione e controllo
            if (form.$valid) {
                /* for (var i = 0; i < ctrl.EPSchema.properties['type'].enum.length; i++) {
                 if (ctrl.fgElem.type != ctrl.EPSchema.properties['type'].enum[i]) {
                 // emptying field not belonging to selected endpoint-type
                 ctrl.fgElem[ctrl.EPSchema.properties['type'].enum[i]] = undefined;
                 }
                 }

                 ctrl.fgPosElem.ref = "end-point";
                 ctrl.fgPosElem.id = ctrl.fgElem.id;                      // id unique between end points
                 ctrl.fgPosElem.full_id = "endpoint:" + ctrl.fgElem.id;   // id unique across all elements
                 ctrl.fgPosElem.isLinked = false;

                 $uibModalInstance.close({elem: ctrl.fgElem, pos: ctrl.fgPosElem});
                 */
            }
        };
    };
    bigSwitchModalController.$inject = ['$uibModalInstance', 'fg', 'fgPos', 'schema', 'config', 'editFlowRulesModal'];
    angular.module('d3').controller('BigSwitchModalController', bigSwitchModalController);

})();