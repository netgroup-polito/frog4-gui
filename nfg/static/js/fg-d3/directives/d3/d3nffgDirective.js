/**
 * Created by giacomo on 06/05/16.
 */
(function () {
    var d3nffg = function (d3Service, fgDrawService, graphConstant) {
        return {
            restrict: "A",
            require: ["d3nffg", "ngModel"],
            scope: {
                position: "=",
                showBigSwitch: "="
            },
            controller: function ($scope) {
                var ctrl = this;
                ctrl.initializeGraph = function (element) {
                    // Instantiate a new svg graph with defined width and height
                    var svg;
                    svg = d3Service.initiateGraph(element);
                    svg = d3Service.addAttribute(svg, "width", graphConstant.graphWidth);
                    svg = d3Service.addAttribute(svg, "height", graphConstant.graphHeight);

                    // define a section of the graph with object definition
                    var definitions_section = d3Service.addSection(svg, "definitions_section");
                    // define a section of the graph containing the big switch
                    var bigSwitch_section = d3Service.addSection(svg, "bigSwitch_section");
                    // define a section of the graph containing all the VNF
                    var VNF_section = d3Service.addSection(svg, "VNF_section");
                    // define a section of the graph containing all the VNF text
                    var VNF_text_section = d3Service.addSection(svg, "VNF_text_section");
                    // define a section of the graph containing all the connection
                    var connection_section = d3Service.addSection(svg, "connection_section");
                    // define a section of the graph containing all interface and EndPoint
                    var interface_section = d3Service.addSection(svg, "interface_section");

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
                        "BIG_SWITCH",
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
                    /**/

                    ctrl.graph = {
                        svg: svg,
                        definitions: definitions_section,
                        bigSwitch: bigSwitch_section,
                        interfaces: interface_section,
                        vnfs: VNF_section,
                        vnfsText: VNF_text_section,
                        connections: connection_section,
                        showBigSwitch: $scope.showBigSwitch ? true : false
                    };
                };

                ctrl.buildGraph = function (fg, fgPos) {
                    if (fg["end-points"])
                        fgDrawService.buildEPs(fg["end-points"], fgPos["end-points"], ctrl.graph);
                    if (fg["VNFs"])
                        fgDrawService.buildVNFs(fg["VNFs"], fgPos["VNFs"], ctrl.graph);
                    if (fg["big-switch"])
                        fgDrawService.buildBigSwitch(fg["big-switch"], fgPos["big-switch"], fgPos["VNFs"], fgPos["end-points"], ctrl.graph);
                };
                ctrl.clearGraph = function () {
                    ctrl.graph.bigSwitch.selectAll("*").remove();
                    ctrl.graph.interfaces.selectAll("*").remove();
                    ctrl.graph.vnfs.selectAll("*").remove();
                    ctrl.graph.vnfsText.selectAll("*").remove();
                    ctrl.graph.connections.selectAll("*").remove();
                };
                ctrl.checkFlowRules = function (graph) {
                    var isSplitted = false;
                    var flow_rules = graph["big-switch"]["flow-rules"];
                    for (var i = 0; i < flow_rules.length; i++) {
                        for (var j = i + 1; j < flow_rules.length; j++) {
                            if (flow_rules[i]["match"]["port_in"] === flow_rules[j]["match"]["port_in"]) {
                                isSplitted = true;
                            }
                        }
                    }
                    return isSplitted;
                }
            },
            link: function (scope, element, attributes, controllers) {
                var ctrl = controllers[0];
                var ngModel = controllers[1];


                ngModel.$render = function () {
                    if (ngModel.$modelValue) {
                        ctrl.forceBigSwitch = ctrl.checkFlowRules(ngModel.$modelValue);
                        ctrl.graph.showBigSwitch = scope.showBigSwitch || ctrl.forceBigSwitch;
                        ctrl.buildGraph(ngModel.$modelValue, scope.position);
                    } else
                        ctrl.clearGraph();
                };

                scope.$watch(function () {
                        return scope.showBigSwitch;
                    },
                    ngModel.$render);


                ctrl.initializeGraph(element[0]);
            }
        };
    };

    d3nffg.$inject = ["d3Service", "fgDrawService", "graphConstant"];
    angular.module("d3").directive("d3nffg", d3nffg);

})();