/**
 * Created by giacomo on 01/05/16.
 */
(function () {
    'use strict';
    /**
     * Controller for the Forwarding-graph view
     * @param $rootScope
     * @param $scope Scope of the controller
     * @param BackendCallService Service used to dialog with the backend
     * @param $uibModal Provider used to initialize a modal instance
     * @param $dialogs Provide used to initialize a dialog instance
     * @param graphConstant
     * @param fgConst
     * @param InitializationService
     * @param FgModalService
     * @param ExporterService
     * @constructor
     */
    var NFFGController = function ($rootScope, $scope, BackendCallService, $uibModal, $dialogs, graphConstant, fgConst, InitializationService, FgModalService, ExporterService) {
        var ctrl = this;

        //list of the existing graph from the server
        ctrl.existingGraph = [];
        /*        // WIP, load the first graph
         BackendCallService.getAvailableGraphs().then(function (result) {
         ctrl.existingGraph = [];
         if (result["NF-FG"]) {
         for (var i = 0; i < result["NF-FG"].length; i++) {
         ctrl.existingGraph.push({
         id: result["NF-FG"][i]["forwarding-graph"].id,
         name: result["NF-FG"][i]["forwarding-graph"].name
         });
         }
         //load the first graph
         if(result["NF-FG"][0]){

         }
         }
         }, function (error) {
         console.log("Something went wrong:", error);
         ctrl.existingGraph = [];
         });*/

        BackendCallService.getJSONSchema().then(function (result) {
            ctrl.schema = result;
        }, function () {
            console.log("Something went wrong:", error);
            //TODO: mostrare errore
        });


        /**
         * Initialize the position object for the graph
         * @param graph The forwarding graph which position object will be created
         * @returns {{}} The position object
         */
        var initializePosition = function (graph) {
            var pos = {};
            pos["end-points"] = InitializationService.initEPsPos(graph["end-points"]);
            pos["VNFs"] = InitializationService.initVNFsPos(graph["VNFs"]);
            pos["big-switch"] = InitializationService.initBigSwitchPos(pos["VNFs"], pos["end-points"]);
            pos["big-switch"]["flow-rules"] = InitializationService.initFlowRulesLink(graph["big-switch"]["flow-rules"]);
            return pos;
        };
        //control variable used to show the edit button
        ctrl.showEditButton = false;
        //control variable used to change the view mode
        ctrl.showBigSwitch = false;
        //control variable used to be aware if the graph has only complex mode
        ctrl.isForced = false;
        //control variable used to start the link creation process
        ctrl.isLinkCreation = false;

        //the forwarding graph loaded
        ctrl.fg = null;
        //the position object of the loaded graph
        ctrl.fgPos = null;
        //the currently selected element
        ctrl.selectedElement = null;

        /**
         * Function to toggle the view of the button to add element to the graph
         */
        ctrl.toggleEditButton = function () {
            ctrl.showEditButton = !ctrl.showEditButton;
        };
        /**
         * Function to toggle the view of the big-switch mode
         */
        ctrl.toggleBigSwitch = function () {
            ctrl.showBigSwitch = !ctrl.showBigSwitch;
            if (ctrl.isForced)
                $dialogs.notify('Splitted Rules', 'Your graph has a split, only Complex View is available!');
        };

        /**
         * Function to show the dialog used to edit the graph name,id and description
         */
        ctrl.updateFGInfo = function () {
            // the new modal description
            var updateInfoModal = $uibModal.open({
                animation: false,
                templateUrl: '/static/pages/refactor/modals/updateFGInfo.html',
                controller: 'UpdateFGInfoController',
                controllerAs: 'UpdateFGInfoCtrl',
                size: 'lg',
                resolve: {
                    // the info passed to the controller of the modal
                    info: function () {
                        return {
                            id: ctrl.fg.id,
                            description: ctrl.fg.description,
                            name: ctrl.fg.name
                        }
                    }
                }
            });
            // function to get the result of the dialog
            updateInfoModal.result.then(function (res) {
                ctrl.fg.id = res.id;
                ctrl.fg.description = res.description;
                ctrl.fg.name = res.name;
            });
        };

        /**
         * Function to show the dialog used to load a graph from the server
         */
        ctrl.loadFromServer = function () {
            //the new modal description
            var loadFromServerModal = $uibModal.open({
                animation: false,
                templateUrl: '/static/pages/refactor/modals/loadFromServer.html',
                controller: 'LoadFromServerController',
                controllerAs: 'loadServerCtrl',
                size: 'lg'
            });
            // function to get the result of the dialog
            loadFromServerModal.result.then(function (fg) {
                // check if all component exist ( should not be needed )
                if (!fg["forwarding-graph"]["end-points"])
                    fg["forwarding-graph"]["end-points"] = [];
                if (!fg["forwarding-graph"]["VNFs"])
                    fg["forwarding-graph"]["VNFs"] = [];
                if (!fg["forwarding-graph"]["big-switch"])
                    fg["forwarding-graph"]["big-switch"] = {"flow-rules": []};
                if (fg["forwarding-graph"]["big-switch"] && !fg["forwarding-graph"]["big-switch"]["flow-rules"])
                    fg["forwarding-graph"]["big-switch"]["flow-rules"] = [];

                // Initialize the graph position object (missing the possibility to load the position too)
                ctrl.fgPos = initializePosition(fg["forwarding-graph"]);
                // loading the graph (always load the graph later to prevent error)
                ctrl.fg = fg["forwarding-graph"];

                ctrl.selectedElement = null;
            });
        };

        /**
         * Function to deploy a graph
         */
        ctrl.deploy = function () {
            BackendCallService.putGraph(ExporterService.exportForwardingGraph(ctrl.fg,ctrl.fgPos))
                .then(function (result) {
                    if (result.success != 'undefined')
                        $dialogs.notify('Deploy', 'The graph has been successfully deployed');
                    else
                        $dialogs.error('Deploy', 'Error - see the universal node log');
                }, function () {
                    console.log("Something went wrong");
                    $dialogs.error('Deploy', 'Error - see the universal node log');
                });
        };

        /**
         * Function to save a current graph on local file
         */
        ctrl.saveOnLocalFS = function () {
            //the new modal description
            var saveOnLocalModal = $uibModal.open({
                animation: false,
                templateUrl: '/static/pages/refactor/modals/saveOnLocalFS.html',
                controller: 'SaveOnLocalController',
                controllerAs: 'saveClientCtrl',
                size: 'md',
                resolve: {
                    graph: function () {
                        return clone(ctrl.fg)
                    },
                    graphPosition: function () {
                        return clone(ctrl.fgPos)
                    }
                }
            });
            // function to get the result of the dialog
            saveOnLocalModal.result.then(function () {
                //Correctly saved
            });
        };


        /**
         * Function to show the dialog used to load a graph from the local file system
         */
        ctrl.loadFromLocalFS = function () {
            //the new modal description
            var loadFromLocalModal = $uibModal.open({
                animation: false,
                templateUrl: '/static/pages/refactor/modals/loadFromLocalFS.html',
                controller: 'LoadFromLocalController',
                controllerAs: 'loadClientCtrl',
                size: 'lg'
            });
            // function to get the result of the dialog
            loadFromLocalModal.result.then(function (fg) {
                // check if all component exist ( should not be needed )
                if (!fg["forwarding-graph"]["end-points"])
                    fg["forwarding-graph"]["end-points"] = [];
                if (!fg["forwarding-graph"]["VNFs"])
                    fg["forwarding-graph"]["VNFs"] = [];
                if (!fg["forwarding-graph"]["big-switch"])
                    fg["forwarding-graph"]["big-switch"] = {"flow-rules": []};
                if (fg["forwarding-graph"]["big-switch"] && !fg["forwarding-graph"]["big-switch"]["flow-rules"])
                    fg["forwarding-graph"]["big-switch"]["flow-rules"] = [];

                // Initialize the graph position object (missing the possibility to load the position too)
                ctrl.fgPos = initializePosition(fg["forwarding-graph"]);
                // loading the graph (always load the graph later to prevent error)
                ctrl.fg = fg["forwarding-graph"];

                ctrl.selectedElement = null;
            });
        };


        var resetGraph = function () {
            ctrl.isLinkCreation = false;
            $rootScope.$broadcast("linkCreationChanged", ctrl.isLinkCreation);
            ctrl.fg = null;
            ctrl.fgPos = null;
            //istanzio un grafico vuoto
            ctrl.fg = {
                "VNFs": [],
                "end-points": [],
                "big-switch": {
                    "flow-rules": []
                }
            };
            ctrl.fgPos = {
                "VNFs": {},
                "end-points": {},
                "big-switch": {
                    "flow-rules": {},
                    "interfaces": {}
                }
            };
        };

        ctrl.newForwardingGraph = function () {
            if (ctrl.fg) {
                var confirm = $dialogs.confirm('Please Confirm', 'Any unsaved changes to the current graph will be lost. Continue?');
                confirm.result.then(function () {
                    resetGraph();
                });
            } else {
                resetGraph();
            }
        };

        ctrl.newEP = function () {
            var epModal = FgModalService.newEndpointModal(ctrl.fg, ctrl.fgPos, ctrl.schema);

            epModal.result.then(function (res) {
                //copiare la pos e copiare l'EP
                ctrl.fgPos["end-points"][res.pos.id] = res.pos;
                ctrl.fgPos["big-switch"].interfaces[res.pos.full_id] = {
                    ref: "BS_interface",
                    full_id: res.pos.full_id,         // use the same id to match them during graph build
                    parent_ep_id: res.pos.id     // id of the endpoint
                };

                ctrl.fg["end-points"].push(res.elem);

            });
        };

        ctrl.newVNF = function () {
            BackendCallService.getTemplates().then(function (result) {

                var epModal = FgModalService.newVNFModal(ctrl.fg, ctrl.fgPos, ctrl.schema, result.templates);

                epModal.result.then(function (res) {
                    //
                    console.log(JSON.stringify(res));
                    //copiare la pos e copiare l'EP
                    ctrl.fgPos["VNFs"][res.pos.id] = res.pos;

                    angular.forEach(res.pos.ports, function (port) {
                        // adding a reference to each port as interface
                        // adding information ( some may be deleted because unused)
                        ctrl.fgPos["big-switch"].interfaces[port.full_id] = {
                            ref: "BS_interface",
                            full_id: port.full_id,                   // use the same id to match them during graph build
                            parent_vnf_id: port.parent_vnf_id,  // vnf of the port
                            parent_vnf_port: port.id            // id of the port
                        }
                    });

                    ctrl.fg["VNFs"].push(res.elem);

                });
            }, function (error) {
                console.log("Something went wrong:", error);
                //TODO: mostrare errore
            });

        };

        ctrl.newLink = function () {
            ctrl.isLinkCreation = !ctrl.isLinkCreation;
            $rootScope.$broadcast("linkCreationChanged", ctrl.isLinkCreation);
        };

        ctrl.onLinkCreation = function (orig, dest) {
            //console.log("Start: " + JSON.stringify(orig));
            //console.log("End: " + JSON.stringify(dest));
            ctrl.isLinkCreation = false;
            $rootScope.$broadcast("linkCreationChanged", ctrl.isLinkCreation);

            var existing = false;
            for (var i = 0; i < ctrl.fg["big-switch"]["flow-rules"].length; i++) {
                var rules = ctrl.fg["big-switch"]["flow-rules"][i];
                if (rules["match"]["port_in"] == orig.full_id && rules["actions"][0]["output_to_port"] == dest.full_id)
                    existing = true;
            }
            if (existing) {
                $dialogs.notify('Flow Rules', 'The flow-rule you are trying to add already exists.');
            } else {
                var elements = {start: orig, end: dest};

                var frModal = FgModalService.newFlowRulesModal(ctrl.fg, ctrl.schema, elements);

                frModal.result.then(function (res) {
                    //
                    console.log(JSON.stringify(res));


                    if (ctrl.fgPos["big-switch"]["flow-rules"][orig.full_id]) { // if it exist a rules starting from the same origin
                        if (!ctrl.fgPos["big-switch"]["flow-rules"][orig.full_id][dest.full_id]) { // if it does not exist this rules add it else do nothing
                            ctrl.fgPos["big-switch"]["flow-rules"][orig.full_id][dest.full_id] = {
                                origin: orig.full_id,
                                destination: dest.full_id,
                                isFullDuplex: false
                            };
                        }
                    } else { //if it does not exist
                        if (ctrl.fgPos["big-switch"]["flow-rules"][dest.full_id]) { //check if it exist rule from the destination
                            if (ctrl.fgPos["big-switch"]["flow-rules"][dest.full_id][orig.full_id]) { //if it exist check if exist the opposite of this rule
                                ctrl.fgPos["big-switch"]["flow-rules"][dest.full_id][orig.full_id].isFullDuplex = true;
                            } else { // if not add the rule orig -> dest
                                ctrl.fgPos["big-switch"]["flow-rules"][orig.full_id] = {};
                                ctrl.fgPos["big-switch"]["flow-rules"][orig.full_id][dest.full_id] = {
                                    origin: orig.full_id,
                                    destination: dest.full_id,
                                    isFullDuplex: false
                                };
                            }
                        } else { //if no rule exist for the destination create a new rule orig -> dest
                            ctrl.fgPos["big-switch"]["flow-rules"][orig.full_id] = {};
                            ctrl.fgPos["big-switch"]["flow-rules"][orig.full_id][dest.full_id] = {
                                origin: orig.full_id,
                                destination: dest.full_id,
                                isFullDuplex: false
                            };
                        }
                    }

                    ctrl.fg["big-switch"]["flow-rules"].push(res.elem);

                });
            }
        };

        ctrl.getTemplates = function () {
            return BackendCallService.getTemplates();
        };

        ctrl.getFRTableConfig = function () {
            return BackendCallService.getFRTableConfig();
        };

        ctrl.getYangModelVNF = function (vnfType) {
            return BackendCallService.getYangModelVNF(vnfType);
        };

        ctrl.getStateVNF = function (vnfMac, username) {
            return BackendCallService.getStateVNF(vnfMac, username);
        };

        $rootScope.$on("vnfConfig", function (event, res) {
            //if I'm here, means that the state has been modified, so I can put the file into the server
            console.log("event", event);
            console.log("res", res);

            BackendCallService.putStateVNF(res.macAdd, res.username, res.newState).then(function (resultPut) {
                console.log("resultPut", resultPut);
                //swal({title: "Changes saved!", timer: 1000, showConfirmButton: false });
            }, function (error) {
                console.log("BackendCallService.putStateVNF() failed:", error);
                //TODO: mostrare errore
            });
        });


        $rootScope.$on("epUpdated", function (event, res) {
            ctrl.fgPos["end-points"][res.pos.id] = res.pos;
            var i = 0;
            for (; ctrl.fg["end-points"][i].id != res.elem.id; i++);
            ctrl.fg["end-points"][i] = res.elem;
        });
        $rootScope.$on("vnfUpdated", function (event, res) {

            var exitPort = {};

            angular.forEach(ctrl.fgPos["VNFs"][res.elem.id].ports, function (port, key) {
                if (!res.pos.ports[key]) {
                    exitPort[key] = port;
                }
            });


            angular.forEach(res.pos.ports, function (port) {
                if (!ctrl.fgPos["big-switch"].interfaces[port.full_id]) {
                    ctrl.fgPos["big-switch"].interfaces[port.full_id] = {
                        ref: "BS_interface",
                        full_id: port.full_id,                   // use the same id to match them during graph build
                        parent_vnf_id: port.parent_vnf_id,  // vnf of the port
                        parent_vnf_port: port.id            // id of the port
                    }
                }
            });

            angular.forEach(exitPort, function (port, key) {

                delete ctrl.fgPos["big-switch"].interfaces[port.full_id];

                angular.forEach(ctrl.fgPos["big-switch"]["flow-rules"], function (rule, key) {
                    if (key == port.full_id) {
                        delete ctrl.fgPos["big-switch"]["flow-rules"][key];
                    } else {
                        if (rule[port.full_id]) {
                            delete ctrl.fgPos["big-switch"]["flow-rules"][key][port.full_id];
                        }
                    }
                });

                for (var j = 0; j < ctrl.fg["big-switch"]["flow-rules"].length; j++) {
                    if (ctrl.fg["big-switch"]["flow-rules"][j][fgConst.lkOrigLev1][fgConst.lkOrigLev2] == key) {
                        ctrl.fg["big-switch"]["flow-rules"].splice(j, 1);
                    }
                    if (ctrl.fg["big-switch"]["flow-rules"][j][fgConst.lkDestLev1][fgConst.lkDestLev2][fgConst.lkDestLev3] == key) {
                        ctrl.fg["big-switch"]["flow-rules"].splice(j, 1);
                    }
                }
            });

            ctrl.fgPos["VNFs"][res.elem.id] = res.pos;
            var i = 0;
            for (; ctrl.fg["VNFs"][i].id != res.elem.id; i++);
            ctrl.fg["VNFs"][i] = res.elem;
        });
        $rootScope.$on("flowRulesUpdated", function (event, res) {
            ctrl.fgPos["big-switch"]["flow-rules"] = InitializationService.initFlowRulesLink(res.rules);
            ctrl.fg["big-switch"]["flow-rules"] = res.rules;
        });
        $rootScope.$on("selectElement", function (event, res) {
            if (ctrl.selectedElement == res) {
                ctrl.selectedElement = null;
            } else {
                ctrl.selectedElement = res;
            }
        });
    };

    NFFGController.$inject = ['$rootScope', '$scope', 'BackendCallService', '$uibModal', 'dialogs', 'graphConstant', 'forwardingGraphConstant', 'InitializationService', "FgModalService", "ExporterService"];
    angular.module('fg-gui').controller('NFFGController', NFFGController);

})();