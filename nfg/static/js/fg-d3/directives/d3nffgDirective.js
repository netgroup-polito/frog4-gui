/**
 * Created by giacomo on 06/05/16.
 */
(function () {
    /**
     * Directive for a forwarding graph instance
     * @param d3Service The service encapsulating part of the d3 library API
     * @param fgDrawService The service used to draw the forwarding-graph element
     * @param fgDragService The service used to add drag behavior the forwarding-graph element
     * @param fgModalService The service used to open a modal view
     * @param fgLinkService The service used to add a linking functionality to the forwarding-graph element
     * @param fgClickService The service used to add a click behavior to the forwarding-graph element
     * @param fgUpdateService
     * @param graphConstant The constant used in the graph directive as parameter
     * @returns {{restrict: string, require: string[], scope: {position: string, showBigSwitch: string, isForced: string}, controller: controller, link: link}}
     */
    var d3nffg = function (d3Service, fgDrawService, fgDragService, fgModalService, fgLinkService, fgClickService, fgUpdateService, graphConstant) {
        return {
            /**
             * type of angular directive (can be used via attribute only)
             */
            restrict: "A",
            /**
             * controller need to the application
             * ngModel is the forwarding-graph instance
             */
            require: ["d3nffg", "ngModel"],
            scope: {
                /**
                 * {object} Position object for the forwarding graph
                 */
                position: "=",
                /**
                 * {boolean} Used to change the view from normal to complex(big-switch view)
                 */
                showBigSwitch: "=",
                /**
                 * {boolean} Used from the view using the directive to be aware if the graph is forced to complex mode
                 * @readonly
                 */
                isForced: "=",
                /**
                 * {object} Jsonschema for the forwarding-graph
                 */
                schema: "=",
                /**
                 * {function} Used to get the current template list for the vnf
                 */
                onTemplateRequest: "=",
                /**
                 * {function} Used to get the current Flow Rules Table config
                 */
                onFrTableConfigRequest: "=",
                /**
                 * {function} Used to trigger the link creation event
                 */
                onLinkCreation: "=",
                /**
                 * {boolean} Used to be aware of link creation request
                 */
                isLinkCreation: "=",
                /**
                 * {String} The currently selected element
                 */
                selectedElement: "="
            },
            /**
             * Controller of the directive
             * @param $scope {object} Directive scope
             */
            controller: function ($scope) {
                var ctrl = this;
                /**
                 * Function used to initialize graph
                 * @param element the element used to contain the graph
                 */
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
                   // define a section of the graph containing all the connection
                    var connection_section = d3Service.addSection(svg, "connection_section");
                    // define a section of the graph containing all interface and EndPoint
                    var interface_section = d3Service.addSection(svg, "interface_section");

                    //TODO cambiare la modalità di selezione usando applicando una classe
                    // adding a graph definition for the vnf
                    d3Service.addSimpleDefinition(
                        definitions_section,
                        "rect",
                        {
                            "id": "VNF",
                            "width": graphConstant.vnfWidth,
                            "height": graphConstant.vnfHeigth,
                            "class": "nf"
                        });
                    // adding a graph definition for the big-switch
                    d3Service.addSimpleDefinition(
                        definitions_section,
                        "rect",
                        {
                            "id": "BIG_SWITCH",
                            "width": graphConstant.bigSwitchWidth,
                            "height": graphConstant.bigSwitchHeight,
                            "class": "bs"
                        });
                    // adding a graph definition for the host icon
                    d3Service.addNestedDefinition(
                        definitions_section,
                        "pattern",
                        {
                            "id": "host-icon",
                            "width": 1,
                            "height": 1,
                            "patternContentUnits": "objectBoundingBox",
                            "children": [
                                {
                                    "type": "svg:image",
                                    "xlink:href": "/static/img/pc-blue.png",
                                    //"/static/img/icon-pc.png",
                                    "width": "1",
                                    "height": "1",
                                    "preserveAspectRatio": "xMinYMin slice"
                                }
                            ]
                        });

                    // adding a graph definition for the internet icon
                    d3Service.addNestedDefinition(
                        definitions_section,
                        "pattern",
                        {
                            "id": "internet-icon",
                            "width": 1,
                            "height": 1,
                            "patternContentUnits": "objectBoundingBox",
                            "children": [
                                {
                                    "type": "svg:image",
                                    "xlink:href": "/static/img/internet-blue.png",
                                    //"/static/img/icon-pc.png",
                                    "width": "1",
                                    "height": "1",
                                    "preserveAspectRatio": "xMinYMin slice"
                                }
                            ]
                        });

                    // adding a nested definition for the arrow used for endpoints
                    d3Service.addNestedDefinition(
                        definitions_section,
                        "marker",
                        {
                            "id": "EndpointArrow",
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
                    //adding a nest definition for the arrow used for port and interface
                    d3Service.addNestedDefinition(
                        definitions_section,
                        "marker",
                        {
                            "id": "InterfaceArrow",
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
                        connections: connection_section,
                        showBigSwitch: $scope.showBigSwitch ? true : false,
                        selectedElement: $scope.selectedElement
                    };
                };
                /**
                 * Function to initialize the drag behavior of the different item type
                 * @param ngModel {object} The ngModel Controller used to access the forwarding-graph instance
                 * @param $scope {object} The scope of the directive used to access the position object
                 */
                ctrl.initializeDrag = function (ngModel, $scope) {
                    // ngModel.$modelValue = forwarding graph
                    // $scope.position = position object

                    // initialize drag functionality for endpoints
                    var epDrag = fgDragService
                        .dragEP(function () {
                            return $scope.position["end-points"];
                        }, function () {
                            ctrl.buildGraph(ngModel.$modelValue, $scope.position);
                        });
                    // initialize drag functionality for endpoints
                    var vnfDrag = fgDragService
                        .dragVNF(function () {
                            return $scope.position["VNFs"];
                        }, function () {
                            ctrl.buildGraph(ngModel.$modelValue, $scope.position);
                        });
                    // initialize drag functionality for vnf port
                    var vnfPortDrag = fgDragService
                        .dragPort(function () {
                            return $scope.position["VNFs"];
                        }, function () {
                            ctrl.buildGraph(ngModel.$modelValue, $scope.position);
                        });
                    // initialize drag functionality for big-switch
                    var bigSwitchDrag = fgDragService
                        .dragBS(function () {
                            return $scope.position["big-switch"];
                        }, function () {
                            ctrl.buildGraph(ngModel.$modelValue, $scope.position);
                        });

                    // initialize drag functionality for big-switch interface
                    var bigSwitchInterfaceDrag = fgDragService
                        .dragBSInterface(function () {
                            return $scope.position["big-switch"];
                        }, function () {
                            ctrl.buildGraph(ngModel.$modelValue, $scope.position);
                        });

                    ctrl.graph.drag = {
                        epDrag: epDrag,
                        vnfDrag: vnfDrag,
                        vnfPortDrag: vnfPortDrag,
                        bigSwitchDrag: bigSwitchDrag,
                        bigSwitchInterfaceDrag: bigSwitchInterfaceDrag
                    }
                };
                /**
                 * Function to initialize the update of the information of the different item
                 * @param ngModel {object} The ngModel Controller used to access the forwarding-graph instance
                 * @param $scope {object} The scope of the directive used to access the position object
                 */
                ctrl.initializeUpdate = function (ngModel, $scope) {
                    // ngModel.$modelValue = forwarding graph
                    // $scope.position = position object
                    // initialize update functionality for endpoints
                    var epUpdate = fgUpdateService.updateEP($scope);
                    // initialize update functionality for vnfs
                    var vnfUpdate = fgUpdateService.updateVNF($scope);

                    // initialize update functionality for flow rules
                    var bigSwitch = fgUpdateService.updateBS($scope);
                    ctrl.graph.update = {
                        epUpdate: epUpdate,
                        vnfUpdate: vnfUpdate,
                        bigSwitch: bigSwitch
                        /*flowRulesUpdate: flowRulesUpdate*/
                    }
                };

                /**
                 * Function to initialize the click behavior of the different item
                 * @param ngModel {object} The ngModel Controller used to access the forwarding-graph instance
                 * @param $scope {object} The scope of the directive used to access the position object
                 */
                ctrl.initializeClick = function (ngModel, $scope) {
                    // ngModel.$modelValue = forwarding graph
                    // $scope.position = position object


                    /*ctrl.graph.click = {
                     epClick: epClick
                     }*/
                };
                /**
                 * Function to initialize the link behavior of the different item
                 * @param ngModel {object} The ngModel Controller used to access the forwarding-graph instance
                 * @param $scope {object} The scope of the directive used to access the position object
                 */
                ctrl.initializeLink = function (ngModel, $scope) {
                    // ngModel.$modelValue = forwarding graph
                    // $scope.position = position object


                    ctrl.graph.link = {
                        epLink: fgLinkService.linkEP($scope, ctrl.graph.connections, ctrl.graph.svg),
                        vnfPortLink: fgLinkService.linkVNFPort($scope, ctrl.graph.connections, ctrl.graph.svg),
                        bsInterfaceLink: fgLinkService.linkBSInterface($scope, ctrl.graph.connections, ctrl.graph.svg)
                    }
                };
                /**
                 * Function to start the draw of the element
                 * @param fg {object} The forwarding-graph instance
                 * @param fgPos {object} The position object
                 */
                ctrl.buildGraph = function (fg, fgPos) {
                    // if end-points exists (should not happen in the json is valid)
                    if (fg["end-points"])
                        fgDrawService.buildEPs(fg["end-points"], fgPos["end-points"], ctrl.graph);
                    // if VNFs exists (should not happen in the json is valid)
                    if (fg["VNFs"])
                        fgDrawService.buildVNFs(fg["VNFs"], fgPos["VNFs"], ctrl.graph);
                    // if big-switch exists (should not happen in the json is valid)
                    if (fg["big-switch"])
                        fgDrawService.buildBigSwitch(fg["big-switch"], fgPos["big-switch"], fgPos["VNFs"], fgPos["end-points"], ctrl.graph);
                    // if big-switch and flow-rules exists (should not happen in the json is valid)
                    if (fg["big-switch"] && fg["big-switch"]["flow-rules"])
                        fgDrawService.buildAllLink(fgPos, ctrl.graph);
                    // drawing all tooltip
                    fgDrawService.buildToolTip();
                };
                /**
                 * Function that clear the graph
                 */
                ctrl.clearGraph = function () {
                    ctrl.graph.bigSwitch.selectAll("*").remove();
                    ctrl.graph.interfaces.selectAll("*").remove();
                    ctrl.graph.vnfs.selectAll("*").remove();
                    ctrl.graph.connections.selectAll("*").remove();
                };
                /**
                 * Function to check if a graph has splitted traffic
                 * @param graph {object} The graph to check
                 * @returns {boolean} Return true if has splitted traffic
                 */
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
                /**
                 *  Function to change visualization mode
                 */
                ctrl.changeView = function () {
                    if (ctrl.graph.showBigSwitch) {
                        $(".normalView").hide();
                        $(".bigSwitchView").show();
                    } else {
                        $(".bigSwitchView").hide();
                        $(".normalView").show();
                    }
                }
            },
            /**
             * Directive linking function
             * @param scope The scope of the directive
             * @param element The element to which is bounded
             * @param attributes The attributes of the element
             * @param controllers The controller linked to the directive (its controller. ngModelController)
             */
            link: function (scope, element, attributes, controllers) {
                var ctrl = controllers[0];
                var ngModel = controllers[1];


                /**
                 * Function called each time the ngModel value change to render the graph
                 */
                ngModel.$render = function () {
                    //if the model has a value draw the graph
                    if (ngModel.$modelValue) {
                        //check if is splitted
                        scope.isForced = ctrl.checkFlowRules(ngModel.$modelValue);
                        ctrl.graph.showBigSwitch = scope.showBigSwitch || scope.isForced;
                        //update scope
                        // showBigSwitch
                        if (scope.showBigSwitch != ctrl.graph.showBigSwitch) {
                            scope.showBigSwitch = ctrl.graph.showBigSwitch;
                        }
                        // build the graph
                        ctrl.buildGraph(ngModel.$modelValue, scope.position);
                        // change the shown element
                        ctrl.changeView();
                    } else // else clear it
                        ctrl.clearGraph();
                };

                /**
                 * function to watch the change of the view mode
                 */
                scope.$watch(function () {
                        return scope.showBigSwitch;
                    },
                    function () {
                        if (scope.showBigSwitch != ctrl.graph.showBigSwitch)
                            ngModel.$render()
                    });
                /**
                 * function to watch the change of the flow-rules
                 */
                scope.$watchCollection(function () {
                        if (ngModel.$modelValue)
                            return ngModel.$modelValue["big-switch"]["flow-rules"];
                    },
                    function () {
                        ngModel.$render()
                    });
                /**
                 * function to watch the change of the VNFs
                 */
                scope.$watchCollection(function () {
                        if (ngModel.$modelValue)
                            return ngModel.$modelValue["VNFs"];
                    },
                    function () {
                        ngModel.$render()
                    });
                /**
                 * function to watch the change of the endpoints
                 */
                scope.$watchCollection(function () {
                        if (ngModel.$modelValue)
                            return ngModel.$modelValue["end-points"];
                    },
                    function () {
                        ngModel.$render()
                    });

                //initialize the directive
                ctrl.initializeGraph(element[0]);
                ctrl.initializeDrag(ngModel, scope);
                ctrl.initializeUpdate(ngModel, scope);
                ctrl.initializeClick(ngModel, scope);
                ctrl.initializeLink(ngModel, scope);
            }
        };
    };

    d3nffg.$inject = ["d3Service", "fgDrawService", "fgDragService", "FgModalService", "fgLinkService", "fgClickService" ,"fgUpdateService", "graphConstant"];
    angular.module("d3").directive("d3nffg", d3nffg);

})();