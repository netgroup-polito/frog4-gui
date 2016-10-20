/**
 * Created by giacomo on 16/10/16.
 */

(function () {
    /**
     * Service to initialize position element used in graph building phase
     * @returns {{initEPsPos: _initEPsPos, initVNFsPos: _initVNFsPos, initBigSwitchPos: _initBigSwitchPos, initFlowRulesLink: _initFlowRulesLink}}
     * @constructor
     */
    var ExporterService = function () {

        /**
         * Function to build a valid representation of the endpoints for the universal-node
         * @param eps List of the endpoints of the forwarding graph
         * @param epsPos Object representation for the EPs position
         * @returns {[]} List of the endpoints valid for the universal node
         * @private
         */
        function _exportEPs(eps, epsPos) {

        }

        /**
         * Function to build a valid representation of the VNFs for the universal-node
         * @param vnfs List of the VNFs of the forwarding graph
         * @param vnfsPos Object representation of the VNFs for the position object
         * @returns {[]} List of the VNFs valid for the universal node
         * @private
         */
        function _exportVNFs(vnfs, vnfsPos) {

        }

        /**
         * Function to initialize the object for the position of the big-switch used in the graph building phase
         * @param bigSwitch Object with the position of the VNFs and information used in the graph building phase
         * @param bigSwitchPos Object with the position of the end-points and information used in the graph building phase
         * @returns {{}} Object representation of the big-switch for the position object, containing all the big-switch interfaces
         * @private
         */
        function _exportBigSwitch(bigSwitch, bigSwitchPos) {

        }

        /**
         * Function to build a valid representation of the flow-rules for the universal-node
         * @param flowRules List of the flow-rules of the forwarding graph
         * @param flowRulesPos Object representation of the flow-rules for the position object
         * @return {[]} List of the flow-rules valid for the universal node
         * @private
         */
        function _exportFlowRules(flowRules, flowRulesPos) {

        }

        /**
         * Function to build a valid representation of the flow-rules for the universal-node
         * @param fg The forwarding graph
         * @param fgPos Object representation of the graph position object
         * @return {{}} List of the flow-rules valid for the universal node
         * @private
         */
        function _exportForwardingGraph(fg, fgPos) {
            var graph = {
                "fowarding-graph": clone(fg)
            };
            graph["end-points"] = _exportEPs(fg["end-points"], fgPos["end-points"]);
            graph["VNFs"] = _exportVNFs(fg["VNFs"], fgPos["VNFs"]);
            graph["big-switch"] = _exportBigSwitch(fg["big-switch"], fgPos["big-switch"]);
        }

        return {
            exportEPs: _exportEPs,
            exportVNFs: _exportVNFs,
            exportBigSwitch: _exportBigSwitch,
            exportFlowRules: _exportFlowRules,
            exportForwardingGraph: _exportForwardingGraph
        };
    };

    ExporterService.$inject = ["forwardingGraphConstant"];
    angular.module("d3").service("ExporterService", ExporterService);
})();


