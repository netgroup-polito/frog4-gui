/**
 * Created by giacomo on 13/08/16.
 */
(function () {
    'use strict';
    /**
     * The controller for the modal used to add an end-point
     * @param $uibModalInstance The instance of the modal which load the controller
     * @param fgConst
     * @param fg
     * @param schema
     * @param elements
     */
    var newLinkModalController = function ($uibModalInstance, fgConst, fg, schema, elements) {
        var ctrl = this;
        ctrl.saveText = "Add Flow Rule";

        ctrl.matchShown = true;
        ctrl.actionShown = true;

        ctrl.LKSchema = schema.properties["forwarding-graph"].properties["big-switch"].properties["flow-rules"].items;
        ctrl.LKMatch = navigateThroughSchema(ctrl.LKSchema.properties["match"]["$ref"]);
        ctrl.LKAction = navigateThroughSchema(ctrl.LKSchema.properties["actions"].items["$ref"]);
        ctrl.fgElem = {
            id: newID(),
	    priority: 1
        };

        ctrl.fgElem[fgConst.lkOrigLev1] = {};
        ctrl.fgElem[fgConst.lkOrigLev1][fgConst.lkOrigLev2] = elements.start.full_id;
        ctrl.fgElem[fgConst.lkDestLev1] = [{}];
        ctrl.fgElem[fgConst.lkDestLev1][fgConst.lkDestLev2][fgConst.lkDestLev3] = elements.end.full_id;
        //ctrl.fgPosElem = {};

        function newID() {
            var max = 1;
            for (var i = 0; i < fg["big-switch"]["flow-rules"].length; i++) {
                var n = Number(fg["big-switch"]["flow-rules"][i].id);
                if (!isNaN(n) && n >= max) {
                    max = n + 1;
                }
            }
            var zero = 6 - max.toString().length + 1;
            return (new Array(+(zero > 0 && zero))).join("0") + max;
        }

        function navigateThroughSchema(href) {
            var splitted = href.split("/");
            var temp = schema;
            for (var i = 0; i < splitted.length; i++) {
                if (splitted[i] == "#") {
                    temp = schema;
                } else {
                    temp = temp[splitted[i]];
                }
            }
            return temp;
        }

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
                $uibModalInstance.close({elem: ctrl.fgElem});
            }
        };
    };
    newLinkModalController.$inject = ['$uibModalInstance', 'forwardingGraphConstant', 'fg', 'schema', 'elements'];
    angular.module('d3').controller('NewLinkModalController', newLinkModalController);

    /**
     * The controller for the modal used to edit an end-point
     * @param $uibModalInstance The instance of the modal which load the controller
     * @param fgConst
     * @param rule
     * @param schema
     */
    var editLinkModalController = function ($uibModalInstance, fgConst, rule, schema) {
        var ctrl = this;
        ctrl.saveText = "Save Flow Rule";

        ctrl.fgElem = rule;

        ctrl.matchShown = true;
        ctrl.actionShown = true;

        ctrl.LKSchema = schema.properties["forwarding-graph"].properties["big-switch"].properties["flow-rules"].items;
        ctrl.LKMatch = navigateThroughSchema(ctrl.LKSchema.properties["match"]["$ref"]);
        ctrl.LKAction = navigateThroughSchema(ctrl.LKSchema.properties["actions"].items["$ref"]);



        function navigateThroughSchema(href) {
            var splitted = href.split("/");
            var temp = schema;
            for (var i = 0; i < splitted.length; i++) {
                if (splitted[i] == "#") {
                    temp = schema;
                } else {
                    temp = temp[splitted[i]];
                }
            }
            return temp;
        }

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
            if (form.$valid) {
                $uibModalInstance.close({elem: ctrl.fgElem});
            }
        };
    };

    editLinkModalController.$inject = ['$uibModalInstance', 'forwardingGraphConstant', 'rule', 'schema'];
    angular.module('d3').controller('EditLinkModalController', editLinkModalController);

})();
