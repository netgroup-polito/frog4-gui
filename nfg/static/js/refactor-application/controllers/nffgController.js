/**
 * Created by giacomo on 01/05/16.
 */
(function () {
    'use strict';

    var NFFGController = function ($scope, BackendCallService, $uibModal, $dialogs, graphConstant, d3Service, InitializationService) {
        var ctrl = this;

        ctrl.existingGraph = [];

        BackendCallService.getAvailableGraphs().then(function (result) {
            ctrl.existingGraph = [];
            if (result["NF-FG"]) {
                for (var i = 0; i < result["NF-FG"].length; i++) {
                    ctrl.existingGraph.push({
                        id: result["NF-FG"][i]["forwarding-graph"].id,
                        name: result["NF-FG"][i]["forwarding-graph"].name
                    });
                }
            }
        }, function (error) {
            console.log("Something went wrong:", error);
            ctrl.existingGraph = [];
        });

        var initializePosition = function (graph) {

            var pos = {};
            pos["end-points"] = InitializationService.initEPsPos(graph["end-points"]);
            pos["VNFs"] = InitializationService.initVNFsPos(graph["VNFs"]);
            pos["big-switch"] = InitializationService.initBigSwitchPos(pos["VNFs"], pos["end-points"]);
            pos["big-switch"]["flow-rules"] = InitializationService.initFlowRulesLink(graph["big-switch"]["flow-rules"]);

            return pos;
        };

        ctrl.showEditButton = false;
        ctrl.showBigSwitch = false;
        ctrl.isForced = false;
        ctrl.fg = null;
        ctrl.fgPos = null;

        $scope.$watch(function () {
                return ctrl.isForced;
            },
            function () {
                if (ctrl.isForced)
                    $dialogs.notify('Splitted Rules', 'Your graph has a split, only Complex View is available!');
            });

        ctrl.toggleEditButton = function () {
            ctrl.showEditButton = !ctrl.showEditButton;
        };
        ctrl.toggleBigSwitch = function () {
            ctrl.showBigSwitch = !ctrl.showBigSwitch;
        };

        ctrl.updateFGInfo = function () {
            var updateInfoModal = $uibModal.open({
                animation: false,
                templateUrl: '/static/pages/refactor/modals/updateFGInfo.html',
                controller: 'UpdateFGInfoController',
                controllerAs: 'UpdateFGInfoCtrl',
                size: 'lg',
                resolve: {
                    info: function () {
                        return {
                            id: ctrl.fg.id,
                            description: ctrl.fg.description,
                            name: ctrl.fg.name
                        }
                    }
                }
            });
            updateInfoModal.result.then(function (res) {
                ctrl.fg.id = res.id;
                ctrl.fg.description = res.description;
                ctrl.fg.name = res.name;
            });
        };

        ctrl.loadFromServer = function () {
            var loadFromServerModal = $uibModal.open({
                animation: false,
                templateUrl: '/static/pages/refactor/modals/loadFromServer.html',
                controller: 'LoadFromServerController',
                controllerAs: 'loadServerCtrl',
                size: 'lg'
            });
            loadFromServerModal.result.then(function (fg) {

                if (!fg["forwarding-graph"]["end-points"])
                    fg["forwarding-graph"]["end-points"] = [];
                if (!fg["forwarding-graph"]["VNFs"])
                    fg["forwarding-graph"]["VNFs"] = [];
                if (!fg["forwarding-graph"]["big-switch"])
                    fg["forwarding-graph"]["big-switch"] = {"flow-rules": []};

                ctrl.fgPos = initializePosition(fg["forwarding-graph"]);
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
                    "flow_rules": []
                }
            };
            ctrl.fgPos = {
                "VNFs": [],
                "end-points": [],
                "big-switch": {
                    "flow_rules": []
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

    };

    NFFGController.$inject = ['$scope', 'BackendCallService', '$uibModal', 'dialogs', 'graphConstant', 'd3Service', 'InitializationService'];
    angular.module('fg-gui').controller('NFFGController', NFFGController);

})();