/**
 * Created by giacomo on 16/10/16.
 */

(function () {
    /**
     * Service to initialize position element used in graph building phase
     * @returns {{exportEPs: _exportEPs, exportVNFs: _exportVNFs, exportBigSwitch: _exportBigSwitch, exportFlowRules: _exportFlowRules, exportForwardingGraph: _exportForwardingGraph}}
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
            if (epsPos) {
                for (var i = 0; i < eps.length; i++) {
                    var pos = {};
                    pos.x = epsPos[eps[i].id].x;
                    pos.y = epsPos[eps[i].id].y;
                    eps[i]["gui-position"] = pos;
                }
            }
            return eps;
        }

        /**
         * Function to build a valid representation of the VNFs for the universal-node
         * @param vnfs List of the VNFs of the forwarding graph
         * @param vnfsPos Object representation of the VNFs for the position object
         * @returns {[]} List of the VNFs valid for the universal node
         * @private
         */
        function _exportVNFs(vnfs, vnfsPos) {
            if (vnfsPos) {
                for (var i = 0; i < vnfs.length; i++) {
                    var pos = {};
                    pos.x = vnfsPos[vnfs[i].id].x;
                    pos.y = vnfsPos[vnfs[i].id].y;
                    vnfs[i]["gui-position"] = pos;
                    for (var j = 0; j < vnfs[i].ports.length; j++) {
                        var pos2 = {};
                        pos2.x = vnfsPos[vnfs[i].id].ports[vnfs[i].ports[j]].x;
                        pos2.y = vnfsPos[vnfs[i].id].ports[vnfs[i].ports[j]].y;
                        vnfs[i]["gui-position"] = pos2;
                    }
                }
            }
            return vnfs;
        }

        /**
         * Function to initialize the object for the position of the big-switch used in the graph building phase
         * @param bigSwitch Object with the position of the VNFs and information used in the graph building phase
         * @param bigSwitchPos Object with the position of the end-points and information used in the graph building phase
         * @returns {{}} Object representation of the big-switch for the position object, containing all the big-switch interfaces
         * @private
         */
        function _exportBigSwitch(bigSwitch, bigSwitchPos) {
            return bigSwitch;
        }

        /**
         * Function to build a valid representation of the flow-rules for the universal-node
         * @param flowRules List of the flow-rules of the forwarding graph
         * @param flowRulesPos Object representation of the flow-rules for the position object
         * @return {[]} List of the flow-rules valid for the universal node
         * @private
         */
        function _exportFlowRules(flowRules, flowRulesPos) {
            return flowRules;
        }

        /**
         * Function to build a valid representation of the flow-rules for the universal-node
         * @param fg The forwarding graph
         * @param fgPos Object representation of the graph position object
         * @return {{}} List of the flow-rules valid for the universal node
         * @private
         */
        function _exportForwardingGraph(fg, fgPos) {
            var graph = clone(fg);
            graph["end-points"] = _exportEPs(fg["end-points"], fgPos ? fgPos["end-points"] : undefined);
            graph["VNFs"] = _exportVNFs(fg["VNFs"], fgPos ? fgPos["VNFs"] : undefined);
            graph["big-switch"] = _exportBigSwitch(fg["big-switch"], fgPos ? fgPos["big-switch"] : undefined);
            return {
                "forwarding-graph": graph
            };
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


