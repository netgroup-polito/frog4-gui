/**
 * Created by giacomo on 01/05/16.
 */
(function () {
    'use strict';

    var NFFGController = function (BackendCallService, $uibModal, d3Service, graphConstant, $dialogs) {
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

        var initializeGraph = function () {
            // Instantiate a new svg graph with defined width and height
            var svg;
            svg = d3Service.initiateGraph("#my_canvas");
            svg = d3Service.addAttribute(svg, "width", graphConstant.graphWidth);
            svg = d3Service.addAttribute(svg, "height", graphConstant.graphHeight);

            // define a section of the graph with object definition
            var definitions_section = d3Service.addSection(svg, "definitions_section");
            // define a section of the graph containing the big switch
            var bigSwitch_section = d3Service.addSection(svg, "bigSwitch_section");
            // define a section of the graph containing all interface and EndPoint
            var interface_section = d3Service.addSection(svg, "interface_section");
            // define a section of the graph containing all the VNF
            var VNF_section = d3Service.addSection(svg, "VNF_section");
            // define a section of the graph containing all the VNF text
            var VNF_text_section = d3Service.addSection(svg, "VNF_text_section");
            // define a section of the graph containing all the connection
            var connection_section = d3Service.addSection(svg, "connection_section");

            ctrl.graph = {
                svg: svg,
                definitions: definitions_section,
                bigSwitch: bigSwitch_section,
                interfaces: interface_section,
                vnfs: VNF_section,
                vnfsText: VNF_text_section,
                connections: connection_section
            };
        };

        initializeGraph();

        ctrl.showEditButton = false;
        ctrl.fg = null;

        ctrl.toggleEditButton = function () {
            ctrl.showEditButton = !ctrl.showEditButton;
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

        var resetGraph = function () {
            ctrl.fg = null;
            //istanzio un grafico vuoto
            ctrl.fg = {
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

    NFFGController.$inject = ['BackendCallService', '$uibModal', 'd3Service', 'graphConstant', 'dialogs'];
    angular.module('fg-gui').controller('NFFGController', NFFGController);

})();