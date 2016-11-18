/**
 * Created by giacomo on 09/08/16.
 */
(function () {
    "use strict";
    /**
     *
     * @returns {{removeEP:_removeEP,removeVNF:_removeVNF,removeFlowrule:_removeFlowrule}}
     */
    var ManipulationService = function (fgConst, InitializationService) {

        function _addEP() {

        }

        /**
         *
         * @param fg
         * @param fgPos
         * @param epId
         * @returns {{fg: *, fgPos: *}}
         * @private
         */
        function _removeEP(fg, fgPos, epId) {
            for (var i = 0; i < fg["end-points"].length; i++) {
                if (fg["end-points"][i].id == epId)
                    break;
            }

            //for each flow rules
            for (var j = 0; j < fg["big-switch"]["flow-rules"].length; j++) {
                //check portIn
                if (fg["big-switch"]["flow-rules"][j][fgConst.lkOrigLev1][fgConst.lkOrigLev2].indexOf("endpoint:" + epId) >= 0) {
                    //remove rules with origin in the vnf
                    fg["big-switch"]["flow-rules"].splice(j, 1);
                    j--;
                    continue;
                }
                //check each output to port
                for (var k = 0; k < fg["big-switch"]["flow-rules"][j][fgConst.lkDestLev1].length; k++) {
                    if (ctrl.fg["big-switch"]["flow-rules"][j][fgConst.lkDestLev1][k][fgConst.lkDestLev3].indexOf("endpoint:" + epId) >= 0) {
                        //remove rules terminating in the vnf
                        fg["big-switch"]["flow-rules"].splice(j, 1);
                        j--;
                        break;
                    }
                }
            }

            //removing end-point
            delete fgPos["big-switch"]["interfaces"]["endpoint:" + epId];

            fg["end-points"].splice(i, 1);
            delete fgPos["end-points"][epId];

            fgPos["big-switch"]["flow-rules"] = InitializationService.initFlowRulesLink(fg["big-switch"]["flow-rules"]);

            return {fg: fg, fgPos: fgPos};
        }

        function _addVNF() {

        }

        /**
         *
         * @param fg
         * @param fgPos
         * @param vnfId
         * @returns {{fg: *, fgPos: *}}
         * @private
         */
        function _removeVNF(fg, fgPos, vnfId) {

            for (var i = 0; i < fg["VNFs"].length; i++) {
                if (fg["VNFs"][i].id == vnfId)
                    break;
            }


            //for each flow rules
            for (var j = 0; j < fg["big-switch"]["flow-rules"].length; j++) {
                //check portIn
                if (fg["big-switch"]["flow-rules"][j][fgConst.lkOrigLev1][fgConst.lkOrigLev2].indexOf("vnf:" + vnfId) >= 0) {
                    //remove rules with origin in the vnf
                    fg["big-switch"]["flow-rules"].splice(j, 1);
                    j--;
                    continue;
                }
                //check each output to port
                for (var k = 0; k < fg["big-switch"]["flow-rules"][j][fgConst.lkDestLev1].length; k++) {
                    if (fg["big-switch"]["flow-rules"][j][fgConst.lkDestLev1][k][fgConst.lkDestLev3].indexOf("vnf:" + vnfId) >= 0) {
                        //remove rules terminating in the vnf
                        fg["big-switch"]["flow-rules"].splice(j, 1);
                        j--;
                        break;
                    }
                }
            }

            //removing vnf
            var exitVNFPos = fgPos["VNFs"][vnfId];

            angular.forEach(exitVNFPos.ports, function (port) {
                delete fgPos["big-switch"]["interfaces"][port.full_id];
            });
            fg["VNFs"].splice(i, 1);
            delete fgPos["VNFs"][vnfId];


            fgPos["big-switch"]["flow-rules"] = InitializationService.initFlowRulesLink(fg["big-switch"]["flow-rules"]);

            return {fg: fg, fgPos: fgPos};
        }

        function _addFlowrule() {

        }

        /**
         *
         * @param fg
         * @param fgPos
         * @param frId
         * @returns {{fg: *, fgPos: *}}
         * @private
         */
        function _removeFlowrule(fg, fgPos, frId) {
            for (var i = 0; i < fg["big-switch"]["flow-rules"].length; i++) {
                if (fg["big-switch"]["flow-rules"][i].id == frId)
                    break;
            }
            fg["big-switch"]["flow-rules"].splice(i, 1);
            fgPos["big-switch"]["flow-rules"] = InitializationService.initFlowRulesLink(fg["big-switch"]["flow-rules"]);
            return {fg: fg, fgPos: fgPos};
        }

        return {
            removeEP: _removeEP,
            removeVNF: _removeVNF,
            removeFlowrule: _removeFlowrule
        }

    };
    ManipulationService.$inject = ["forwardingGraphConstant", "InitializationService"];

    angular.module('d3').service('ManipulationService', ManipulationService);
})();