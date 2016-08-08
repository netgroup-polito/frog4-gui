/**
 * Created by giacomo on 01/05/16.
 */
(function () {
    'use strict';
    /**
     * Controller for the Forwarding-graph view
     * @param $scope Scope of the controller
     * @param BackendCallService Service used to dialog with the backend
     * @param $uibModal Provider used to initialize a modal instance
     * @param $dialogs Provide used to initialize a dialog instance
     * @param graphConstant
     * @param d3Service
     * @param InitializationService
     * @param FgModalService
     * @constructor
     */
    var NFFGController = function ($scope, BackendCallService, $uibModal, $dialogs, graphConstant, d3Service, InitializationService, FgModalService) {
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

        //the forwarding graph loaded
        ctrl.fg = null;
        //the position object of the loaded graph
        ctrl.fgPos = null;

        // watching for change of the control variable to show if it's forced complex view
        /*$scope.$watch(function () {
         return ctrl.isForced;
         },
         function () {
         if (ctrl.isForced)
         $dialogs.notify('Splitted Rules', 'Your graph has a split, only Complex View is available!');
         });
         */
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
            });
        };


        var resetGraph = function () {
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
                //
                console.log(JSON.stringify(res));
                //copiare la pos e copiare l'EP
                ctrl.fgPos["end-points"][res.pos.id] = res.pos;
                ctrl.fgPos["big-switch"].interfaces[res.pos.full_id] = {
                    ref: "BS_interface",
                    id: res.pos.full_id,         // use the same id to match them during graph build
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
                            id: port.full_id,                   // use the same id to match them during graph build
                            parent_vnf_id: port.parent_vnf_id,  // vnf of the port
                            parent_vnf_port: port.id            // id of the port
                        }
                    });

                    ctrl.fg["VNFs"].push(res.elem);

                });
            }, function () {
                console.log("Something went wrong:", error);
                //TODO: mostrare errore
            });

        };
        ctrl.getTemplates = function () {
            return BackendCallService.getTemplates();
        }

    };

    NFFGController.$inject = ['$scope', 'BackendCallService', '$uibModal', 'dialogs', 'graphConstant', 'd3Service', 'InitializationService', "FgModalService"];
    angular.module('fg-gui').controller('NFFGController', NFFGController);

})();