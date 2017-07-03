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
        vnfXTollerance: 0.2,
        vnfYTollerance: 0.2,
        bigSwitchWidth: 200,
        bigSwitchHeight: 130,
        bigSwitchXTollerance: 0.2,
        bigSwitchYTollerance: 0.2,
        epRadius:22,
        ifRadius:8

    };

    /**
     * Constant for the interpretation of the forwarding-graph
     * @type {{lkOrigLev1: string, lkOrigLev2: string, lkDestLev1: string, lkDestLev2: number, lkDestLev3: string}}
     */
    var forwardingGraphConstant = {
        lkOrigLev1 : "match",
        lkOrigLev2 : "port_in",
        lkDestLev1 : "actions",
        lkDestLev2 : 0,
        lkDestLev3 : "output_to_port"
    };

    angular.module("d3").constant("graphConstant", graphConstant);
    angular.module("d3").constant("forwardingGraphConstant", forwardingGraphConstant);
})();