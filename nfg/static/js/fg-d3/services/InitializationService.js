/**
 * Created by giacomo on 16/05/16.
 */
(function () {
    /**
     * Service to initialize position element used in graph building phase
     * @returns {{initEPsPos: _initEPsPos, initVNFsPos: _initVNFsPos, initBigSwitchPos: _initBigSwitchPos, initFlowRulesLink: _initFlowRulesLink}}
     * @constructor
     */
    var InitializationService = function (forwardingGraphConstant) {

        /**
         * Function to initialize the object for the position of the endpoints used in the graph building phase
         * @param EP_list List of the endpoints of the forwarding graph
         * @returns {{}} Object representation of the endpoints for the position object
         * @private
         */
        function _initEPsPos(EP_list) {
            //transforming into object for easier access
            var EP_Pos = {};
            for (var i = 0; i < EP_list.length; i++) {
                //adding information ( some may be deleted because unused)
                var ep = {};
                ep.ref = "end-point";                       // to be deleted
                ep.id = EP_list[i].id;                      // id unique between end points
                ep.full_id = "endpoint:" + EP_list[i].id;   // id unique across all elements
                ep.isLinked = false;                        //
                EP_Pos[ep.id] = ep;
            }
            return EP_Pos;
        }

        /**
         * Function to initialize the object for the position of the VNFs used in the graph building phase
         * @param VNF_list List of the VNFs of the forwarding graph
         * @returns {{}} Object representation of the VNFs for the position object
         * @private
         */
        function _initVNFsPos(VNF_list) {
            //transforming into object for easier access
            var VNF_Pos = {};
            for (var i = 0; i < VNF_list.length; i++) {
                //adding information ( some may be deleted because unused)
                var vnf = {};
                vnf.ref = "vnf";                        // to be deleted
                vnf.full_id = "vnf:" + VNF_list[i].id;  // id unique across all elements
                //transforming also ports into object for easier access
                vnf.ports = {};
                VNF_list[i].ports.forEach(function (port) {
                    //adding information ( some may be deleted because unused)
                    var e = {};
                    e.ref = "VNF_interface";                                // to be deleted
                    e.id = port.id;                                         // id of the port, unique in vnf
                    e.full_id = "vnf:" + VNF_list[i].id + ":" + port.id;    // id unique across all elements
                    e.parent_vnf_id = VNF_list[i].id;                       // id of the vnf associated
                    e.isLinked = false;                                     //
                    vnf.ports[port.id] = e
                });
                VNF_Pos[VNF_list[i].id] = vnf;
            }
            return VNF_Pos;
        }

        /**
         * Function to initialize the object for the position of the big-switch used in the graph building phase
         * @param VNF_pos Object with the position of the VNFs and information used in the graph building phase
         * @param EP_pos Object with the position of the end-points and information used in the graph building phase
         * @returns {{}} Object representation of the big-switch for the position object, containing all the big-switch interfaces
         * @private
         */
        function _initBigSwitchPos(VNF_pos, EP_pos) {
            //transforming into object for easier access
            var BS_Pos = {};
            BS_Pos.interfaces = {};

            if (VNF_pos)
                angular.forEach(VNF_pos, function (vnf) {
                    angular.forEach(vnf.ports, function (port) {
                        // adding a reference to each port as interface
                        // adding information ( some may be deleted because unused)
                        BS_Pos.interfaces[port.full_id] = {
                            ref: "BS_interface",
                            id: port.full_id,                   // use the same id to match them during graph build
                            parent_vnf_id: port.parent_vnf_id,  // vnf of the port
                            parent_vnf_port: port.id            // id of the port
                        }
                    });
                });
            if (EP_pos)
                angular.forEach(EP_pos, function (ep) {
                    // adding a reference to each endpoint as interface
                    // adding information ( some may be deleted because unused)
                    BS_Pos.interfaces[ep.full_id] = {
                        ref: "BS_interface",
                        id: ep.full_id,         // use the same id to match them during graph build
                        parent_ep_id: ep.id     // id of the endpoint
                    }
                });

            return BS_Pos;
        }

        /**
         * Function to initialize the object for the position of the flow-rules used in the graph building phase
         * @param flow_rules List of the flow-rules of the forwarding graph
         * @returns {{}} Object representation of the flow-rules for the position object
         * @private
         */
        function _initFlowRulesLink(flow_rules) {
            //transforming into object for easier access
            var flow_rules_link = {};
            flow_rules.forEach(function (rule) {
                // if the name of the property change modify them in constants.js
                // id of the origin of the link
                // [match][port_in]
                var orig = rule[forwardingGraphConstant.linkOriginFirstLevel][forwardingGraphConstant.linkOriginSecondLevel];
                // id of the destination of the link
                //[actions][0][output_to_port]
                var dest = rule[forwardingGraphConstant.linkDestinationFirstLevel][forwardingGraphConstant.linkDestinationSecondLevel][forwardingGraphConstant.linkDestinationThirdLevel];


                if (flow_rules_link[orig]) { // if it exist a rules starting from the same origin
                    if (!flow_rules_link[orig][dest]) { // if it does not exist this rules add it else do nothing
                        flow_rules_link[orig][dest] = {
                            origin: orig,
                            destination: dest,
                            isFullDuplex: false
                        };
                    }
                } else { //if it does not exist
                    if (flow_rules_link[dest]) { //check if it exist rule from the destination
                        if (flow_rules_link[dest][orig]) { //if it exist check if exist the opposite of this rule
                            flow_rules_link[dest][orig].isFullDuplex = true;
                        } else { // if not add the rule orig -> dest
                            flow_rules_link[orig] = {};
                            flow_rules_link[orig][dest] = {
                                origin: orig,
                                destination: dest,
                                isFullDuplex: false
                            };
                        }
                    } else { //if no rule exist for the destination create a new rule orig -> dest
                        flow_rules_link[orig] = {};
                        flow_rules_link[orig][dest] = {
                            origin: orig,
                            destination: dest,
                            isFullDuplex: false
                        };
                    }
                }

            });
            return flow_rules_link;
        }

        return {
            initEPsPos: _initEPsPos,
            initVNFsPos: _initVNFsPos,
            initBigSwitchPos: _initBigSwitchPos,
            initFlowRulesLink: _initFlowRulesLink
        };
    };

    InitializationService.$inject = ["forwardingGraphConstant"];
    angular.module("d3").service("InitializationService", InitializationService);
})();


