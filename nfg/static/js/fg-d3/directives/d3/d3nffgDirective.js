/**
 * Created by giacomo on 06/05/16.
 */
(function () {
    var d3nffg = function (d3Service, fgDrawService, fgDragService, graphConstant) {
        return {
            restrict: "A",
            require: ["d3nffg", "ngModel"],
            scope: {
                position: "=",
                showBigSwitch: "=",
                isForced: "="
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

                    d3Service.addSimpleDefinition(
                        definitions_section,
                        "rect",
                        {
                            "id": "VNF",
                            "width": graphConstant.vnfWidth,
                            "height": graphConstant.vnfHeigth,
                            "class": "nf"
                        });
                    d3Service.addSimpleDefinition(
                        definitions_section,
                        "rect",
                        {
                            "id": "VNF_selected",
                            "width": graphConstant.vnfWidth,
                            "height": graphConstant.vnfHeigth,
                            "class": "nf-select"
                        });
                    d3Service.addSimpleDefinition(
                        definitions_section,
                        "rect",
                        {
                            "id": "BIG_SWITCH",
                            "width": graphConstant.bigSwitchWidth,
                            "height": graphConstant.bigSwitchHeight,
                            "class": "big-switch"
                        });
                    d3Service.addSimpleDefinition(
                        definitions_section,
                        "rect",
                        {
                            "id": "BIG_SWITCH_selected",
                            "width": graphConstant.bigSwitchWidth,
                            "height": graphConstant.bigSwitchHeight,
                            "class": "big-switch-select"
                        });
                    /**/
                    d3Service.addNestedDefinition(
                        definitions_section,
                        "marker",
                        {
                            "id": "Arrow",
                            "viewBox": "0 -5 10 10",
                            "refX": 25,
                            "refY": 0,
                            "markerWidth": 5,
                            "markerHeight": 5,
                            "orient": "auto",
                            "children": [
                                {
                                    "type": "path",
                                    "d": "M0,-5 L10,0 L0,5",
                                    "class": "arrowHead"
                                }
                            ]
                        });
                    d3Service.addNestedDefinition(
                        definitions_section,
                        "marker",
                        {
                            "id": "InternalArrow",
                            "viewBox": "0 -5 10 10",
                            "refX": 15,
                            "refY": 0,
                            "markerWidth": 5,
                            "markerHeight": 5,
                            "orient": "auto",
                            "children": [
                                {
                                    "type": "path",
                                    "d": "M0,-5 L10,0 L0,5",
                                    "class": "arrowHead"
                                }
                            ]
                        });


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

                ctrl.initializeDrag = function (ngModel, $scope) {

                    var epDrag = fgDragService
                        .dragEP(function () {
                            return $scope.position["end-points"]
                        }, function () {
                            ctrl.buildGraph(ngModel.$modelValue, $scope.position);
                        });
                    var vnfDrag = fgDragService
                        .dragVNF(function () {
                            return $scope.position["VNFs"]
                        }, function () {
                            ctrl.buildGraph(ngModel.$modelValue, $scope.position);
                        });

                    var vnfInterfaceDrag = fgDragService
                        .dragInterface(function () {
                            return $scope.position["VNFs"]
                        }, function () {
                            ctrl.buildGraph(ngModel.$modelValue, $scope.position);
                        });
                    var bigSwitchDrag = fgDragService
                        .dragBS(function () {
                            return $scope.position["big-switch"]
                        }, function () {
                            ctrl.buildGraph(ngModel.$modelValue, $scope.position);
                        });
                    var bigSwitchInterfaceDrag = fgDragService
                        .dragBSInterface(function () {
                            return $scope.position["big-switch"]
                        }, function () {
                            ctrl.buildGraph(ngModel.$modelValue, $scope.position);
                        });

                    ctrl.graph.drag = {
                        epDrag: epDrag,
                        vnfDrag: vnfDrag,
                        vnfInterfaceDrag: vnfInterfaceDrag,
                        bigSwitchDrag: bigSwitchDrag,
                        bigSwitchInterfaceDrag:bigSwitchInterfaceDrag
                    }
                };

                ctrl.buildGraph = function (fg, fgPos) {
                    if (fg["end-points"])
                        fgDrawService.buildEPs(fg["end-points"], fgPos["end-points"], ctrl.graph);
                    if (fg["VNFs"])
                        fgDrawService.buildVNFs(fg["VNFs"], fgPos["VNFs"], ctrl.graph);
                    if (fg["big-switch"])
                        fgDrawService.buildBigSwitch(fg["big-switch"], fgPos["big-switch"], fgPos["VNFs"], fgPos["end-points"], ctrl.graph);
                    if (fg["big-switch"] && fg["big-switch"]["flow-rules"] && fg["big-switch"]["flow-rules"].length > 0)
                        fgDrawService.buildAllLink(fg, fgPos, ctrl.graph);
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
                };
                ctrl.changeView = function () {
                    if (ctrl.graph.showBigSwitch) {
                        $(".normaleView").hide();
                        $(".bigSwitchView").show();
                    } else {
                        $(".bigSwitchView").hide();
                        $(".normaleView").show();
                    }
                }
            },
            link: function (scope, element, attributes, controllers) {
                var ctrl = controllers[0];
                var ngModel = controllers[1];


                ngModel.$render = function () {
                    if (ngModel.$modelValue) {
                        scope.isForced = ctrl.checkFlowRules(ngModel.$modelValue);
                        ctrl.graph.showBigSwitch = scope.showBigSwitch || scope.isForced;
                        if (scope.showBigSwitch != ctrl.graph.showBigSwitch) {
                            scope.showBigSwitch = ctrl.graph.showBigSwitch;
                        }
                        ctrl.buildGraph(ngModel.$modelValue, scope.position);
                        ctrl.changeView();
                    } else
                        ctrl.clearGraph();
                };

                scope.$watch(function () {
                        return scope.showBigSwitch;
                    },
                    function () {
                        if (scope.showBigSwitch != ctrl.graph.showBigSwitch)
                            ngModel.$render()
                    });


                ctrl.initializeGraph(element[0]);
                ctrl.initializeDrag(ngModel, scope);
            }
        };
    };

    d3nffg.$inject = ["d3Service", "fgDrawService", "fgDragService", "graphConstant"];
    angular.module("d3").directive("d3nffg", d3nffg);

})();