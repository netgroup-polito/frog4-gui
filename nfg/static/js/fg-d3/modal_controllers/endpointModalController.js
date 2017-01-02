/**
 * Created by giacomo on 03/07/16.
 */
(function () {
    'use strict';
    /**
     * The controller for the modal used to add an end-point
     * @param $uibModalInstance The instance of the modal which load the controller
     * @param fg
     * @param fgPos
     * @param schema
     */
    var newEndpointModalController = function ($uibModalInstance, fg, fgPos, schema) {
        var ctrl = this;
        ctrl.saveText = "Add Endpoint";
        ctrl.EPSchema = schema.properties["forwarding-graph"].properties["end-points"].items;
        ctrl.EPProperties = null;
        ctrl.fgElem = {
            id: newID()
        };
        ctrl.fgPosElem = {};

        function newID() {
            var max = 1;
            for (var i = 0; i < fg["end-points"].length; i++) {
                var n = Number(fg["end-points"][i].id);
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

        ctrl.selectFirstType = function () {
            ctrl.fgElem.type = "interface";
            ctrl.typeChanged();
        };
        ctrl.typeChanged = function () {
            var type = ctrl.EPSchema.properties[ctrl.fgElem.type];
            ctrl.EPProperties = null;
            if (type) {
                var path = type["$ref"];
                ctrl.EPProperties = navigateThroughSchema(path)
            }
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
                for (var i = 0; i < ctrl.EPSchema.properties['type'].enum.length; i++) {
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
            }
        };
    };
    newEndpointModalController.$inject = ['$uibModalInstance', 'fg', 'fgPos', 'schema'];
    angular.module('d3').controller('NewEndpointModalController', newEndpointModalController);

    /**
     * The controller for the modal used to edit an end-point
     * @param $uibModalInstance The instance of the modal which load the controller
     * @param elem
     * @param pos
     * @param schema
     */
    var editEndpointModalController = function ($uibModalInstance, elem, pos, schema) {
        var ctrl = this;
        ctrl.saveText = "Save Endpoint";
        ctrl.fgElem = elem;
        ctrl.fgPosElem = pos;
        ctrl.EPSchema = schema.properties["forwarding-graph"].properties["end-points"].items;
        ctrl.EPProperties = null;
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
                for (var i = 0; i < ctrl.EPSchema.properties['type'].enum.length; i++) {
                    if (ctrl.fgElem.type != ctrl.EPSchema.properties['type'].enum[i]) {
                        // emptying field not belonging to selected endpoint-type
                        ctrl.fgElem[ctrl.EPSchema.properties['type'].enum[i]] = undefined;
                    }
                }
                $uibModalInstance.close({elem: ctrl.fgElem, pos: ctrl.fgPosElem});
            }
        };

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

        ctrl.typeChanged = function () {
            var type = ctrl.EPSchema.properties[ctrl.fgElem.type];
            ctrl.EPProperties = null;
            if (type) {
                var path = type["$ref"];
                ctrl.EPProperties = navigateThroughSchema(path)
            }
        };
        ctrl.typeChanged();
    };

    editEndpointModalController.$inject = ['$uibModalInstance', 'elem', 'pos', 'schema'];
    angular.module('d3').controller('EditEndpointModalController', editEndpointModalController);

})();