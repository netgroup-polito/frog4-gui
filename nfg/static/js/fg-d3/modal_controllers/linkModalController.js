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
        ctrl.LKMatchUsed = [];

        ctrl.LKAction = navigateThroughSchema(ctrl.LKSchema.properties["actions"].items["$ref"]);
        ctrl.LKActionHelper = [];
        ctrl.fgElem = {
            id: newID(),
            priority: 1
        };

        ctrl.fgElem[fgConst.lkOrigLev1] = {};
        ctrl.fgElem[fgConst.lkOrigLev1][fgConst.lkOrigLev2] = elements.start.full_id;
        var placeholder = {
            name: fgConst.lkOrigLev2,
            type: ctrl.LKMatch.properties[fgConst.lkOrigLev2].type
        };
        ctrl.LKMatchUsed.push(placeholder);

        ctrl.fgElem[fgConst.lkDestLev1] = [];
        var elem = {};
        elem[fgConst.lkDestLev3] = elements.end.full_id;
        ctrl.fgElem[fgConst.lkDestLev1].push(elem);
        ctrl.LKActionHelper.push(fgConst.lkDestLev3);
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

        function checkActionAndMatch() {
            var resA = false;
            for (var i = 0; i < ctrl.fgElem[fgConst.lkDestLev1].length; i++) {
                if (ctrl.fgElem[fgConst.lkDestLev1][i][fgConst.lkDestLev3]) {
                    resA = true;
                }
            }
            var resB = !(!ctrl.fgElem[fgConst.lkOrigLev1][fgConst.lkOrigLev2]);
            return resA && resB;
        }

        ctrl.addAction = function () {
            ctrl.fgElem[fgConst.lkDestLev1].push({});
            ctrl.LKActionHelper.push("");
        };

        ctrl.removeAction = function (index) {
            ctrl.fgElem[fgConst.lkDestLev1].splice(index, 1);
            ctrl.LKActionHelper.splice(index, 1);
        };

        ctrl.getAvailableMatch = function (current) {
            var available = [];
            for (var prop in ctrl.LKMatch.properties) {
                if (ctrl.fgElem[fgConst.lkOrigLev1][prop] == null || ctrl.fgElem[fgConst.lkOrigLev1][prop] == undefined) {
                    available.push(prop);
                }
            }
            available.push(current);
            return available;
        };

        ctrl.matchChanged = function (index, name) {
            ctrl.LKMatchUsed[index].type = ctrl.LKMatch.properties[name].type;
        }

        ctrl.addMatch = function () {
            ctrl.fgElem[fgConst.lkDestLev1].push({});
            ctrl.LKMatchUsed.push({
                name: "",
                type: ""
            });
        };

        ctrl.removeMatch = function (index) {
            delete ctrl.fgElem[fgConst.lkOrigLev1][ctrl.LKMatchUsed[index].name];
            ctrl.LKMatchUsed.splice(index, 1);
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
            if (form.$valid && checkActionAndMatch()) {
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
        ctrl.LKMatchUsed = [];

        for (var prop in ctrl.fgElem[fgConst.lkOrigLev1]) {
            if (ctrl.fgElem[fgConst.lkOrigLev1][prop]) {
                ctrl.LKMatchUsed.push({
                    name: prop,
                    type: ctrl.LKMatch.properties[prop].type
                });
            }
        }

        ctrl.LKAction = navigateThroughSchema(ctrl.LKSchema.properties["actions"].items["$ref"]);
        ctrl.LKActionHelper = [];

        for (var i = 0; i < ctrl.fgElem[fgConst.lkDestLev1].length; i++) {
            if (ctrl.fgElem[fgConst.lkDestLev1][i]) {
                ctrl.LKActionHelper.push(Object.keys(ctrl.fgElem[fgConst.lkDestLev1][i])[0]);
            }
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

        function checkActionAndMatch() {
            var resA = false;
            for (var i = 0; i < ctrl.fgElem[fgConst.lkDestLev1].length; i++) {
                if (ctrl.fgElem[fgConst.lkDestLev1][i][fgConst.lkDestLev3]) {
                    resA = true;
                }
            }
            var resB = !(!ctrl.fgElem[fgConst.lkOrigLev1][fgConst.lkOrigLev2]);
            return resA && resB;
        }

        ctrl.addAction = function () {
            ctrl.fgElem[fgConst.lkDestLev1].push({});
            ctrl.LKActionHelper.push("");
        };

        ctrl.removeAction = function (index) {
            ctrl.fgElem[fgConst.lkDestLev1].splice(index, 1);
            ctrl.LKActionHelper.splice(index, 1);
        };

        ctrl.getAvailableMatch = function (current) {
            var available = [];
            for (var prop in ctrl.LKMatch.properties) {
                if (ctrl.fgElem[fgConst.lkOrigLev1][prop] == null || ctrl.fgElem[fgConst.lkOrigLev1][prop] == undefined) {
                    available.push(prop);
                }
            }
            available.push(current);
            return available;
        };

        ctrl.matchChanged = function (index, name) {
            ctrl.LKMatchUsed[index].type = ctrl.LKMatch.properties[name].type;
        }

        ctrl.addMatch = function () {
            ctrl.fgElem[fgConst.lkDestLev1].push({});
            ctrl.LKMatchUsed.push({
                name: "",
                type: ""
            });
        };

        ctrl.removeMatch = function (index) {
            delete ctrl.fgElem[fgConst.lkOrigLev1][ctrl.LKMatchUsed[index].name];
            ctrl.LKMatchUsed.splice(index, 1);
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
            if (form.$valid && checkActionAndMatch()) {
                $uibModalInstance.close({elem: ctrl.fgElem});
            }
        };
    };

    editLinkModalController.$inject = ['$uibModalInstance', 'forwardingGraphConstant', 'rule', 'schema'];
    angular.module('d3').controller('EditLinkModalController', editLinkModalController);

})();
