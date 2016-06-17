/**
 * Created by giacomo on 30/05/16.
 */
(function () {
    "use strict";
    /**
     * Constants for the graph visualization
     * @type {{graphHeight: string, graphWidth: string, vnfWidth: number, vnfHeigth: number, bigSwitchWidth: number, bigSwitchHeight: number, epRadius: number, ifRadius: number}}
     */
    var graphConstant = {
        graphHeight: "100%",
        graphWidth: "100%",
        vnfWidth: 150,
        vnfHeigth: 60,
        bigSwitchWidth: 200,
        bigSwitchHeight: 130,
        epRadius:22,
        ifRadius:8

    };

    /**
     * Constant for the interpretation of the forwarding-graph
     * @type {{linkOriginFirstLevel: string, linkOriginSecondLevel: string, linkDestinationFirstLevel: string, linkDestinationSecondLevel: number, linkDestinationThirdLevel: string}}
     */
    var forwardingGraphConstant = {
        linkOriginFirstLevel : "match",
        linkOriginSecondLevel : "port_in",
        linkDestinationFirstLevel : "actions",
        linkDestinationSecondLevel : 0,
        linkDestinationThirdLevel : "output_to_port"
    };

    angular.module("d3").constant("graphConstant", graphConstant);
    angular.module("d3").constant("forwardingGraphConstant", forwardingGraphConstant);

})();