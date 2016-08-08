/**
 * Created by giacomo on 01/08/16.
 */
(function () {
    'use strict';
    /**
     * The controller for the modal used to add a vnf
     * @param $uibModalInstance The instance of the modal which load the controller
     * @param fg
     * @param fgPos
     * @param schema
     * @param templates
     */
    var newVNFModalController = function ($uibModalInstance, fg, fgPos, schema, templates) {
        var ctrl = this;
        ctrl.saveText = "Add VNF";
        ctrl.templates = templates;
        ctrl.VNFSchema = schema.properties["forwarding-graph"].properties["VNFs"].items;
        ctrl.VNFProperties = null;
        ctrl.vnfPortInfo = null;
        ctrl.fgElem = {
            id: newID()
        };
        ctrl.fgPosElem = {};

        ctrl.infoShown = true;
        ctrl.portShown = true;

        function newID() {
            var max = 1;
            for (var i = 0; i < fg["VNFs"].length; i++) {
                var n = Number(fg["VNFs"][i].id);
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

        function calculatePort() {
            if (ctrl.VNFProperties) {
                ctrl.fgElem.ports = [];
                ctrl.vnfPortInfo = [];
                for (var i = 0; i < ctrl.VNFProperties.ports.length; i++) {
                    var minId = ctrl.VNFProperties.ports[i].position.split('-')[0];
                    var maxId = ctrl.VNFProperties.ports[i].position.split('-')[1];
                    var min = ctrl.VNFProperties.ports[i].min;
                    var max = maxId == "N" ? Number.MAX_VALUE : Number(maxId) - Number(minId) + 1;
                    var j = 0;
                    var id = Number(minId);
                    for (; j < min; j++, id++) {
                        ctrl.fgElem.ports.push({id: ctrl.VNFProperties.ports[i].label + ":" + id});
                    }
                    ctrl.vnfPortInfo.push({
                        label: ctrl.VNFProperties.ports[i].label,
                        minId: Number(minId),
                        maxId: maxId,
                        min: min,
                        max: max,
                        tot: j
                    })
                }
            } else {
                ctrl.vnfPortInfo = null;
            }
        }

        ctrl.addPort = function (portInfo) {
            var filtered = ctrl.fgElem.ports.filter(function (elem) {
                return elem.id.split(":")[0] == portInfo.label
            }).sort(function (a, b) {
                return (Number(a.id.split(":")[1]) > Number(b.id.split(":")[1]))
            });
            var id = -1;
            if (filtered.length > 0 && Number(filtered[0].id.split(":")[1]) == portInfo.minId) {
                for (var i = 0; i < filtered.length - 1; i++) {
                    if (Number(filtered[i].id.split(":")[1]) != Number(filtered[i + 1].id.split(":")[1]) - 1) {
                        id = Number(filtered[i].id.split(":")[1]) + 1;
                    }
                }
            } else {
                id = portInfo.minId;
            }
            if (id == -1)
                id = portInfo.minId + portInfo.tot;
            ctrl.fgElem.ports.push({id: portInfo.label + ":" + id});
            portInfo.tot++;
        };

        ctrl.removePort = function (port, portInfo) {
            var index = ctrl.fgElem.ports.indexOf(port);
            ctrl.fgElem.ports.splice(index, 1);
            portInfo.tot--;
        };


        ctrl.templateChanged = function () {
            var filtered = ctrl.templates.filter(function (elem) {
                return elem.id == ctrl.fgElem.vnf_template;
            });
            if (filtered.length > 0)
                ctrl.VNFProperties = filtered[0].template;

            calculatePort();
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

                ctrl.fgPosElem.ref = "vnf";
                ctrl.fgPosElem.id = ctrl.fgElem.id;                      // id unique between VNFs
                ctrl.fgPosElem.full_id = "vnf:" + ctrl.fgElem.id;   // id unique across all element
                ctrl.fgPosElem.ports = {};
                ctrl.fgElem.ports.forEach(function (port) {
                    //adding information ( some may be deleted because unused)
                    var e = {};
                    e.ref = "VNF_interface";                                // to be deleted
                    e.id = port.id;                                         // id of the port, unique in vnf
                    e.full_id = "vnf:" + ctrl.fgPosElem.id + ":" + port.id;    // id unique across all elements
                    e.parent_vnf_id = ctrl.fgPosElem.id;                       // id of the vnf associated
                    e.isLinked = false;                                     //
                    ctrl.fgPosElem.ports[port.id] = e
                });
                $uibModalInstance.close({elem: ctrl.fgElem, pos: ctrl.fgPosElem});

                /*for (var i = 0; i < ctrl.EPSchema.properties['type'].enum.length; i++) {
                 if (ctrl.fgElem.type != ctrl.EPSchema.properties['type'].enum[i]) {
                 // emptying field not belonging to selected endpoint-type
                 ctrl.fgElem[ctrl.EPSchema.properties['type'].enum[i]] = undefined;
                 }
                 }*/
            }
        };
    };
    newVNFModalController.$inject = ['$uibModalInstance', 'fg', 'fgPos', 'schema', 'templates'];
    angular.module('d3').controller('NewVNFModalController', newVNFModalController);

    /**
     * The controller for the modal used to edit an end-point
     * @param $uibModalInstance The instance of the modal which load the controller
     * @param elem
     * @param pos
     * @param schema
     */
    var editVNFModalController = function ($uibModalInstance, elem, pos, schema) {
        var ctrl = this;
        ctrl.saveText = "Save VNF";
        ctrl.EPSchema = schema.properties["forwarding-graph"].properties["VNFs"].items;
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
        ctrl.save = function () {
            $uibModalInstance.close();
        };

        ctrl.typeChanged = function () {
            console.log("typechanged")
        }
    };

    editVNFModalController.$inject = ['$uibModalInstance', 'elem', 'pos', 'schema'];
    angular.module('d3').controller('EditVNFModalController', editVNFModalController);

})();