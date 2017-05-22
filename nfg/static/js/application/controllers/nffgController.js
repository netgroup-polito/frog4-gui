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
     * @param AppConstant
     * @param graphConstant
     * @param fgConst
     * @param InitializationService
     * @param FgModalService
     * @param ExporterService
     * @param ManipulationService
     * @constructor
     */
    var NFFGController = function ($rootScope, $scope, BackendCallService, $uibModal, $dialogs, AppConstant, graphConstant, fgConst, InitializationService, FgModalService, ExporterService, ManipulationService) {
        var ctrl = this;
        $scope.AppConstant = AppConstant;

        ctrl.graphOrigin = AppConstant.graphOrigin.LOCAL;
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
            console.log("Something went wrong :", error);
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
        //control variable used to change visibility for the grid
        ctrl.isGridShown = false;


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
         * Function to toggle the view of the grid
         */
        ctrl.toggleGrid = function () {
            ctrl.isGridShown = !ctrl.isGridShown;
        };

        /**
         * Function to show the dialog used to edit the graph name,id and description
         */
        ctrl.updateFGInfo = function () {
            // the new modal description
            var updateInfoModal = $uibModal.open({
                animation: false,
                templateUrl: '/static/pages/modals/updateFGInfo.html',
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
                templateUrl: '/static/pages/modals/loadFromServer.html',
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

                resetGraph();
                // Initialize the graph position object (missing the possibility to load the position too)
                ctrl.fgPos = initializePosition(fg["forwarding-graph"]);
                // loading the graph (always load the graph later to prevent error)
                ctrl.fg = fg["forwarding-graph"];
                ctrl.graphOrigin = AppConstant.graphOrigin.UN;

                $rootScope.$broadcast("selectElement", null);
            });
        };

        /**
         * Function to show the dialog used to load a graph from the repository
         */
        ctrl.loadFromRepository = function () {
            //the new modal description
            var loadFromRepositoryModal = $uibModal.open({
                animation: false,
                templateUrl: '/static/pages/modals/loadFromRepository.html',
                controller: 'LoadFromRepositoryController',
                controllerAs: 'loadRepoCtrl',
                size: 'lg'
            });
            // function to get the result of the dialog
            loadFromRepositoryModal.result.then(function (fg) {
                if (!fg["forwarding-graph"]["end-points"])
                    fg["forwarding-graph"]["end-points"] = [];
                if (!fg["forwarding-graph"]["VNFs"])
                    fg["forwarding-graph"]["VNFs"] = [];
                if (!fg["forwarding-graph"]["big-switch"])
                    fg["forwarding-graph"]["big-switch"] = {"flow-rules": []};
                if (fg["forwarding-graph"]["big-switch"] && !fg["forwarding-graph"]["big-switch"]["flow-rules"])
                    fg["forwarding-graph"]["big-switch"]["flow-rules"] = [];

                resetGraph();
                // Initialize the graph position object (missing the possibility to load the position too)
                ctrl.fgPos = initializePosition(fg["forwarding-graph"]);
                // loading the graph (always load the graph later to prevent error)
                ctrl.fg = fg["forwarding-graph"];
                ctrl.graphOrigin = AppConstant.graphOrigin.REPOSITORY;

                $rootScope.$broadcast("selectElement", null);
            });
        };

        /**
         * Function to save a graph on repository
         */
        ctrl.saveOnRepository = function () {
            BackendCallService.putGraphOnRepo(ExporterService.exportForwardingGraph(ctrl.fg, ctrl.fgPos))
                .then(function () {
                    $dialogs.notify('Save on Graph Repository', 'The graph "' + ctrl.fg.name + '" with ID ' + ctrl.fg.id + ' has been successfully saved');
                }, function () {
                    console.log("Something went wrong");
                    $dialogs.error('Save on Graph Repository', 'Error - see the repository log');
                });
        };

        /**
         * Function to deploy a graph
         */
        ctrl.deploy = function () {
            BackendCallService.putGraph(ExporterService.exportForwardingGraph(ctrl.fg, ctrl.fgPos))
                .then(function (result) {
                    if (result.success != 'undefined')
                        $dialogs.notify('Deploy', 'The graph has been successfully deployed');
                    else
                        $dialogs.error('Deploy', 'Error - see the orchestrator log');
                }, function () {
                    console.log("Something went wrong");
                    $dialogs.error('Deploy', 'Error - see the orchestrator log');
                });
        };

        /**
         * Function to delete a graph from it's original location
         */
        ctrl.delete = function () {
            var confirm = $dialogs.confirm('Please Confirm', 'You are about to delete the graph with id: ' + ctrl.fg.id + ' from the ' + (ctrl.graphOrigin == AppConstant.graphOrigin.UN ? 'Orchestrator' : 'Repository') + '. Continue?');
            confirm.result.then(function () {
                if (ctrl.graphOrigin == AppConstant.graphOrigin.UN) {
                    BackendCallService.deleteGraph(ctrl.fg.id)
                        .then(function (result) {
                            if (result.success != 'undefined') {
                                ctrl.graphOrigin = AppConstant.graphOrigin.LOCAL;
                                $dialogs.notify('Delete', 'The graph has been successfully deleted');
                            }
                            else
                                $dialogs.error('Delete', 'Error - see the orchestrator log');
                        }, function (error) {
                            console.log("Something went wrong");
                            if (error.status != "404")
                                $dialogs.error('Delete', 'Error - see the orchestrator log');
                            else
                                $dialogs.error('Delete', 'Error - the graph does not exist on the orchestrator');
                        });
                } else {
                    BackendCallService.deleteGraphFromRepo(ctrl.fg.id)
                        .then(function (result) {
                            if (result.success != 'undefined') {
                                ctrl.graphOrigin = AppConstant.graphOrigin.LOCAL;
                                $dialogs.notify('Delete', 'The graph has been successfully deleted');
                            }
                            else
                                dialogs.error('Delete', 'Error - see the repository log');
                        }, function (error) {
                            console.log("Something went wrong");
                            if (error.status != "404")
                                $dialogs.error('Delete', 'Error - see the repository log');
                            else
                                $dialogs.error('Delete', 'Error - the graph does not exist in the Repository');
                        });
                }

            });
        };

        /**
         * Function to save a current graph on local file
         */
        ctrl.saveOnLocalFS = function () {
            //the new modal description
            var saveOnLocalModal = $uibModal.open({
                animation: false,
                templateUrl: '/static/pages/modals/saveOnLocalFS.html',
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
                templateUrl: '/static/pages/modals/loadFromLocalFS.html',
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

                resetGraph();
                // Initialize the graph position object (missing the possibility to load the position too)
                ctrl.fgPos = initializePosition(fg["forwarding-graph"]);
                // loading the graph (always load the graph later to prevent error)
                ctrl.fg = fg["forwarding-graph"];
                ctrl.graphOrigin = "local";

                $rootScope.$broadcast("selectElement", null);
            });
        };


        var resetGraph = function () {
            ctrl.isLinkCreation = false;
            $rootScope.$broadcast("linkCreationChanged", ctrl.isLinkCreation);
            ctrl.fg = null;
            ctrl.fgPos = null;
            //istanzio un grafico vuoto
            ctrl.fg = {
                "name": "New Forwarding Graph",
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
            ctrl.graphOrigin = AppConstant.graphOrigin.LOCAL;
            $rootScope.$broadcast("changedGraph");
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
            BackendCallService.getVNFList().then(function (result) {

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
                if (rules["match"]["port_in"] == orig.full_id) {
                    for(var j = 0; j < rules["actions"].length; j++) {
                        if (rules["actions"][i]["output_to_port"] == dest.full_id)
                            existing = true;
                    }
                }
            }
            if (existing) {
                $dialogs.notify('Flow Rules', 'The flow-rule you are trying to add already exists.');
            } else {
                var elements = {start: orig, end: dest};

                var frModal = FgModalService.newFlowRulesModal(ctrl.fg, ctrl.schema, elements);

                frModal.result.then(function (res) {
                    //
                    console.log(JSON.stringify(res));

                    var currentRules = clone(ctrl.fg["big-switch"]["flow-rules"]);
                    currentRules.push(res.elem);
                    ctrl.fgPos["big-switch"]["flow-rules"] = InitializationService.initFlowRulesLink(currentRules);

                    ctrl.fg["big-switch"]["flow-rules"].push(res.elem);

                });
            }
        };

        ctrl.getTemplates = function () {
            return BackendCallService.getVNFList();
        };

        ctrl.getFRTableConfig = function () {
            return BackendCallService.getFRTableConfig();
        };

        ctrl.getVNFModel = function (graphId, vnfIdentifier, tenantId, templateUri) {
            return BackendCallService.getVNFModel(graphId, vnfIdentifier, tenantId, templateUri);
        };

        ctrl.getVNFState = function (graphId, vnfIdentifier, tenantId) {
            return BackendCallService.getVNFState(graphId, vnfIdentifier, tenantId);
        };

        ctrl.deleteSelected = function () {
            var toRemove = ctrl.selectedElement;
            //console.log(JSON.stringify(ctrl.selectedElement, null, '\t'))
            if (toRemove) {
                var dialog = null;
                if (Array.isArray(toRemove)) {
                    //It's a flow rule or a set of
                    if (toRemove.length > 1) {
                        dialog = $dialogs.confirm("Delete link", "This link is made by multiple flow-rules. If you delete it you will delete all the flowr-rules. Are you sure you want to delete it?");
                    } else {
                        dialog = $dialogs.confirm("Delete element", "Are you sure you want to delete this element?");
                    }
                } else {
                    dialog = $dialogs.confirm("Delete element", "Are you sure you want to delete this element?");
                }
                dialog.result.then(function (result) {
                    var newData = {fg: clone(ctrl.fg), fgPos: clone(ctrl.fgPos)}, parts;
                    if (Array.isArray(toRemove)) {
                        //flowrules
                        for (var i = 0; i < toRemove.length; i++) {
                            parts = toRemove[i].split(":");
                            newData = ManipulationService.removeFlowrule(newData.fg, newData.fgPos, parts[1]);
                        }
                        ctrl.fgPos = newData.fgPos;
                        ctrl.fg = newData.fg;
                        //console.log(JSON.stringify(ctrl.fg["big-switch"]["flow-rules"], null, '\t'))
                        //console.log(JSON.stringify(ctrl.fgPos["big-switch"]["flow-rules"], null, '\t'))
                    } else {
                        parts = toRemove.split(":");
                        if (parts[0] == "vnf") {
                            newData = ManipulationService.removeVNF(newData.fg, newData.fgPos, parts[1]);
                            ctrl.fgPos = newData.fgPos;
                            ctrl.fg = newData.fg;
                        } else if (parts[0] == "endpoint") {
                            newData = ManipulationService.removeEP(newData.fg, newData.fgPos, parts[1]);
                            ctrl.fgPos = newData.fgPos;
                            ctrl.fg = newData.fg;
                        }
                    }
                })
            }
        };

        ctrl.deselectSelected = function () {
            $rootScope.$broadcast("selectElement", null);
        };

        $rootScope.$on("vnfConfig", function (event, res) {
            //if I'm here, means that the state has been modified, so I can put the file into the server

            BackendCallService.putStateVNF(res.graphId, res.vnfIdentifier, res.tenantId, res.newState).then(function (resultPut) {
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
                        j--;
                        continue;
                    }
                    if (ctrl.fg["big-switch"]["flow-rules"][j][fgConst.lkDestLev1][fgConst.lkDestLev2][fgConst.lkDestLev3] == key) {
                        ctrl.fg["big-switch"]["flow-rules"].splice(j, 1);
                        j--;
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

    NFFGController.$inject = ['$rootScope', '$scope', 'BackendCallService', '$uibModal', 'dialogs', 'AppConstant', 'graphConstant', 'forwardingGraphConstant', 'InitializationService', "FgModalService", "ExporterService", "ManipulationService"];
    angular.module('fg-gui').controller('NFFGController', NFFGController);

})();
