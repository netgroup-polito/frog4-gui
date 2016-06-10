/**
 * Created by giacomo on 16/05/16.
 */
(function () {
    var InitializationService = function () {

        var _initEPsPos = function (EP_list) {
            var EP_Pos = {};
            for (var i = 0; i < EP_list.length; i++) {
                var ep = {};
                ep.ref = "end-point";
                ep.id = EP_list[i].id;
                ep.full_id = "endpoint:" + EP_list[i].id;
                ep.isLinked = false;
                EP_Pos[EP_list[i].id] = ep;
            }
            return EP_Pos;
        };

        var _initVNFsPos = function (VNF_list) {
            var VNF_Pos = {};
            for (var i = 0; i < VNF_list.length; i++) {
                var vnf = {};
                vnf.ref = "vnf";
                vnf.full_id = "vnf:" + VNF_list[i].id;
                vnf.ports = {};
                VNF_list[i].ports.forEach(function (port) {
                    var e = {};
                    e.ref = "NF_interface";
                    e.id = port.id;
                    e.full_id = "vnf:" + VNF_list[i].id + ":" + port.id;
                    e.parent_vnf_id = VNF_list[i].id;
                    e.isLinked = false;
                    vnf.ports[port.id] = e
                });
                VNF_Pos[VNF_list[i].id] = vnf;
            }
            return VNF_Pos;
        };

        var _initBigSwitchPos = function (big_switch, VNF_pos, EP_pos) {
            var BS_Pos = {};
            BS_Pos.interfaces = {};

            if (VNF_pos)
                angular.forEach(VNF_pos, function (vnf) {
                    angular.forEach(vnf.ports, function (port) {
                        BS_Pos.interfaces[port.full_id] = {
                            ref: "BS_interface",
                            id: port.full_id,
                            parent_vnf_id: port.parent_vnf_id,
                            parent_vnf_port: port.id
                        }
                    });
                });
            if (EP_pos)
                angular.forEach(EP_pos, function (ep) {
                    BS_Pos.interfaces[ep.full_id] = {
                        ref: "BS_interface",
                        id: ep.full_id,
                        parent_ep_id: ep.id
                    }
                });

            return BS_Pos;
        };

        var _initFlowRulesLink = function (flow_rules) {
            var flow_rules_link = {};
            flow_rules.forEach(function (rule) {
                var orig = rule["match"]["port_in"];
                var dest = rule["actions"][0]["output_to_port"];
                //match.port_in
                //actions[0].output_to_port


                if (flow_rules_link[orig]) {
                    if (!flow_rules_link[orig][dest]) {
                        flow_rules_link[orig][dest] = {
                            origin: orig,
                            destination: dest,
                            isFullDuplex: false
                        };
                    }
                } else {
                    if (flow_rules_link[dest]) {
                        if (flow_rules_link[dest][orig]) {
                            flow_rules_link[dest][orig].isFullDuplex = true;
                        } else {
                            flow_rules_link[orig] = {};
                            flow_rules_link[orig][dest] = {
                                origin: orig,
                                destination: dest,
                                isFullDuplex: false
                            };
                        }
                    } else {
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
        };

        return {
            initEPsPos: _initEPsPos,
            initVNFsPos: _initVNFsPos,
            initBigSwitchPos: _initBigSwitchPos,
            initFlowRulesLink: _initFlowRulesLink
        };
    };

    angular.module("d3").service("InitializationService", InitializationService);
})();


