/**
 * Created by giacomo on 01/05/16.
 */
(function () {
    'use strict';

    var NFFGController = function (BackendCallService, $uibModal, $dialogs, graphConstant, d3Service, InitializationService) {
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

            //TODO cambiare la modalità di selezione usando applicando una classe 

            d3Service.addRectDefinition(
                definitions_section,
                "VNF",
                graphConstant.offsetX,
                graphConstant.offsetY,
                graphConstant.vnfWidth,
                graphConstant.vnfHeigth,
                "nf");
            d3Service.addRectDefinition(
                definitions_section,
                "VNF_selected",
                graphConstant.offsetX,
                graphConstant.offsetY,
                graphConstant.vnfWidth,
                graphConstant.vnfHeigth,
                "nf-select");
            d3Service.addRectDefinition(
                definitions_section,
                "VNF_selected",
                graphConstant.offsetX,
                graphConstant.offsetY,
                graphConstant.bigSwitchWidth,
                graphConstant.bigSwitchHeight,
                "big-switch");
            d3Service.addRectDefinition(
                definitions_section,
                "BIG_SWITCH_selected",
                graphConstant.offsetX,
                graphConstant.offsetY,
                graphConstant.bigSwitchWidth,
                graphConstant.bigSwitchHeight,
                "big-switch-select");


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

        var buildGraph = function (fg, fgPos, graph) {
            buildEPs(fg["end-points"], fgPos["end-points"], graph);
        };

        var buildEPs = function (endpoints, pos, graph) {
            graph.interfaces.selectAll(".end-points")
                .data(endpoints)
                .enter()
                .append("circle")
                .attr("class", function (d) {
                    return "end-points " + d.name;
                })
                .attr("id", function (d) {
                    return d.id;
                })
                .attr("r", 22)
                .attr("cx", function (d) {
                    return pos[d.id].x
                })
                .attr("cy", function (d) {
                    return pos[d.id].y
                })
                .attr("title", function (d) {
                    return d.name;
                })
        };

        var initializePosition = function (graph) {

            var pos = {};
            pos["end-points"] = InitializationService.initEPsPos(graph["end-points"], ctrl.graph.svg);

            return pos;
        };

        ctrl.showEditButton = false;
        ctrl.fg = null;
        ctrl.fgPos = null;

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

        ctrl.loadFromServer = function () {
            var loadFromServerModal = $uibModal.open({
                animation: false,
                templateUrl: '/static/pages/refactor/modals/loadFromServer.html',
                controller: 'LoadFromServerController',
                controllerAs: 'loadServerCtrl',
                size: 'lg'
            });
            loadFromServerModal.result.then(function (fg) {
                ctrl.fgPos = initializePosition(fg["forwarding-graph"]);
                ctrl.fg = fg["forwarding-graph"];
                buildGraph(ctrl.fg, ctrl.fgPos,ctrl.graph);
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

    NFFGController.$inject = ['BackendCallService', '$uibModal', 'dialogs', 'graphConstant', 'd3Service', 'InitializationService'];
    angular.module('fg-gui').controller('NFFGController', NFFGController);

})();