/**
 * Created by giacomo on 30/05/16.
 */
(function () {
    "use strict";
    var fgDrawService = function (graphConstant) {
        var _buildEPs = function (endpoints, pos, graph) {

            var alfa = 2 * Math.PI / endpoints.length;
            //selection of all end-point in the graph and association with end-points of the json
            var epElements = graph.interfaces.selectAll(".end-points")
                .data(endpoints, function (d) {
                    return d.id;
                });
            // operation on new element of the collection: add circle
            epElements
                .enter()
                .append("circle")
                .attr("r", graphConstant.epRadius);
            //operation on updated and new element
            epElements
                .attr("id", function (d) {
                    return pos[d.id].full_id;
                })
                .attr("title", function (d) {
                    return d.name;
                })
                .attr("class", function (d) {
                    return "end-points " + d.name; // "end-points" class is the one used for selection in the first step of this function
                })
                .attr("cx", function (d, i) {   // x position of the center of the element
                    if (typeof pos[d.id].x == "number")
                        return pos[d.id].x;
                    else
                        return pos[d.id].x = parseInt(250 * Math.cos(alfa * (i)) + graph.svg.node().getBoundingClientRect().width / 2)

                })
                .attr("cy", function (d, i) {   // y position of the center of the element
                    if (typeof pos[d.id].y == "number")
                        return pos[d.id].y;
                    else
                        return pos[d.id].y = parseInt(250 * Math.sin(alfa * (i)) + graph.svg.node().getBoundingClientRect().height / 2)
                })
                .call(graph.drag.epDrag)
            /*.on("click",selectEndPoints)
             .on("contextmenu",function(d){
             d3.event.preventDefault();
             showEditInfoEP(d.id);
             });*/
            //operation on element going out of the collection
            epElements.exit().remove();

        };

        var _buildVNFs = function (vnfs, pos, graph) {
            var alfa = 2 * Math.PI / vnfs.length;
            //selection of all vnfs in the graph and association with vnf of the json
            var vnfElements = graph.vnfs.selectAll(".vnf")
                .data(vnfs, function (d) {
                    return d.id;
                });
            //operation on new element of the collection, add to the graph using template "VNF"
            vnfElements
                .enter()
                .append("use").attr("xlink:href", "#VNF")
                .attr("class", "vnf");   // "vnf" is the class used for the selection
            //operation on updated and new element
            vnfElements
                .attr("id", function (d) {
                    return pos[d.id].full_id;
                })
                .attr("x", function (d, i) {    // x position of the element
                    if (typeof pos[d.id].x == "number")
                        return pos[d.id].x;
                    else {
                        var limit = graph.svg.node().getBoundingClientRect().width / 2
                            - graphConstant.vnfWidth / 2;
                        var xCenter = (limit - 10) * Math.cos(alfa * (i) + Math.PI / 2);
                        return pos[d.id].x = parseInt(xCenter + limit);
                    }

                })
                .attr("y", function (d, i) {    // y position of the element
                    if (typeof pos[d.id].y == "number")
                        return pos[d.id].y;
                    else {
                        var limit = graph.svg.node().getBoundingClientRect().height / 2
                            - graphConstant.vnfHeigth / 2;
                        var yCenter = (limit - 10) * Math.sin(alfa * (i) + Math.PI / 2);
                        return pos[d.id].y = parseInt(yCenter + limit);

                    }
                })
                .call(graph.drag.vnfDrag)
            /*.on("mousedown", selectVNFs)
             .on("contextmenu", function (d) {
             d3.event.preventDefault();
             showEditInfoVNF(d.id);
             });*/
            //operation on element going out of the collection
            vnfElements.exit().remove();

            var vnfTextElements = graph.vnfsText.selectAll(".vnf-text")
                .data(vnfs, function (d) {
                    return d.id;
                });
            vnfTextElements
                .enter()
                .append("text")
                .attr("class", "vnf-text unselectable")
                .attr("text-anchor", "middle")
                .attr("fill", "white");
            //operation on updated and new element
            vnfTextElements
                .attr("id", function (d) {
                    return "text_" + pos[d.id].full_id;
                })
                .attr("x", function (d) {   // x position of the element
                    return parseInt(pos[d.id].x + graphConstant.vnfWidth / 2)
                })
                .attr("y", function (d) {   // y position of the element
                    return parseInt(pos[d.id].y + graphConstant.vnfHeigth / 2 + 4)
                })
                .text(function (d) {
                    var text;
                    if (!d.name) {
                        text = "Unnamed VNF";
                    } else if (d.name.length >= 18) {
                        text = d.name.slice(0, 18);
                    } else {
                        text = d.name;
                    }
                    return text;
                });
            //operation on element going out of the collection
            vnfTextElements.exit().remove();

            var ports = [];

            vnfs.forEach(function (vnf) {
                vnf.ports.forEach(function (port) {
                    ports.push({
                        port: port,
                        parent: vnf.id,
                        full_id: pos[vnf.id].ports[port.id].full_id
                    });
                });
            });

            var portElements = graph.interfaces.selectAll(".vnf-interface")
                .data(ports, function (d) {
                    return d.full_id;
                });
            portElements
                .enter()
                .append("circle")
                .attr("r", graphConstant.ifRadius)  //radius of the circle element
                .attr("class", "interface vnf-interface"); // "vnf-interface" is the class used for selection
            portElements
                .attr("id", function (d) {
                    return d.full_id;
                })
                .attr("title", function (d) {
                    return d.full_id;
                })
                .attr("cx", function (d, i) {   // x position of the center of the element
                    var portPos = pos[d.parent].ports[d.port.id];
                    portPos.parent_vnf_x = pos[d.parent].x;
                    if (typeof portPos.x != "number") {
                        var totVNFPorts = 0;
                        var me = 0;
                        ports.forEach(function (port) {
                            if (port.parent == d.parent)
                                totVNFPorts++;
                            if (d.full_id == port.full_id)
                                me = totVNFPorts - 1;
                        });
                        portPos.x = parseInt(graphConstant.vnfWidth / totVNFPorts * (me + 0.5));
                    }
                    return parseInt(portPos.x + portPos.parent_vnf_x);
                })
                .attr("cy", function (d) {   // y position of the center of the element
                    var portPos = pos[d.parent].ports[d.port.id];
                    portPos.parent_vnf_y = pos[d.parent].y;
                    if (typeof portPos.y != "number")
                        portPos.y = parseInt(portPos.parent_vnf_y < graph.svg.node().getBoundingClientRect().height / 2 ? graphConstant.vnfHeigth : 0);
                    return parseInt(portPos.y + portPos.parent_vnf_y);
                })
                .attr("parent_NF_position_x", function (d) {
                    return pos[d.parent].x; // x position of the parent vnf
                })
                .attr("parent_NF_position_y", function (d) {
                    return pos[d.parent].y; // y position of the parent vnf
                })
                .attr("parent", function (d) {
                    return pos[d.parent].full_id;    // id of the parent vnf
                })
                .call(graph.drag.vnfInterfaceDrag)
            /*.on("click", select_node);*/
            //operation on element going out of the collection
            portElements.exit().remove()
        };

        var _getPos = function (vnf, bs, port) {
            var pos = {};

            var xPos = vnf.x;
            if (port)
                xPos += port.x;
            var yPos = vnf.y;
            if (port)
                yPos += port.y;

            if (xPos < bs.x)
                pos.x = bs.x;
            else if (xPos > bs.x + graphConstant.bigSwitchWidth)
                pos.x = bs.x + graphConstant.bigSwitchWidth;
            else
                pos.x = xPos;

            if (yPos < bs.y)
                pos.y = bs.y;
            else if (yPos > bs.y + graphConstant.bigSwitchHeight)
                pos.y = bs.y + graphConstant.bigSwitchHeight;
            else
                pos.y = yPos;

            pos.x = parseInt(pos.x - bs.x);
            pos.y = parseInt(pos.y - bs.y);

            return pos;
        };

        var _buildBigSwitch = function (bigswitch, pos, vnfPos, epPos, graph, bsDrag, bsInterfaceDrag) {
            var bigswitchElement = graph.bigSwitch.selectAll(".big-switch")
                .data([bigswitch]);
            bigswitchElement
                .enter()
                .append("use")
                .style("stroke-dasharray", ("8, 4"))
                .attr("xlink:href", "#BIG_SWITCH")
                .attr("class", "big-switch bigSwitchView");
            bigswitchElement
                .attr("x", function () {
                    if (pos.x)
                        return pos.x;
                    else
                        return pos.x = graph.svg.node().getBoundingClientRect().width / 2 - graphConstant.bigSwitchWidth / 2;
                })
                .attr("y", function () {
                    if (pos.y)
                        return pos.y;
                    else
                        return pos.y = graph.svg.node().getBoundingClientRect().height / 2 - graphConstant.bigSwitchHeight / 2;
                })
                .call(graph.drag.bigSwitchDrag)
            /*.on("click", selectBS);*/

            var interfaces = [];

            angular.forEach(pos.interfaces, function (int) {
                interfaces.push(int);
            });

            var bigswitchInterfaceElement = graph.interfaces.selectAll(".bs-interface")
                .data(interfaces, function (d) {
                    return d.id;
                });
            bigswitchInterfaceElement.enter()
                .append("circle")
                .attr("id", function (d) {
                    return d.id;
                })
                .attr("r", graphConstant.ifRadius)
                .attr("class", "bs-interface interface bigSwitchView");
            bigswitchInterfaceElement
                .attr("cx", function (d) {
                    if (typeof d.x != "number")
                        if (d.parent_vnf_id)
                            d.x = _getPos(vnfPos[d.parent_vnf_id], pos, vnfPos[d.parent_vnf_id].ports[d.parent_vnf_port]).x;
                        else
                            d.x = _getPos(epPos[d.parent_ep_id], pos).x;
                    return parseInt(pos.x + d.x);
                })
                .attr("cy", function (d) {
                    if (typeof d.y != "number")
                        if (d.parent_vnf_id)
                            d.y = _getPos(vnfPos[d.parent_vnf_id], pos, vnfPos[d.parent_vnf_id].ports[d.parent_vnf_port]).y;
                        else
                            d.y = _getPos(epPos[d.parent_ep_id], pos).y;
                    return parseInt(pos.y + d.y);
                })
                .call(graph.drag.bigSwitchInterfaceDrag)
            /*.on("click",select_node);*/
            bigswitchInterfaceElement.exit().remove();
        };

        var _buildLink = function (fg, pos, graph) {
            var flowRules = [];
            var allInterface = {};
            angular.forEach(pos["VNFs"], function (vnf) {
                angular.forEach(vnf["ports"], function (port) {
                    allInterface[port.full_id] = port;
                });
            });
            angular.forEach(pos["end-points"], function (ep) {
                allInterface[ep.full_id] = ep;
            });

            angular.forEach(pos["big-switch"]["flow-rules"], function (origin) {
                angular.forEach(origin, function (rule) {
                    if (rule.origin.indexOf("endpoint") > -1) {
                        rule["origin-x"] = allInterface[rule.origin].x;
                        rule["origin-y"] = allInterface[rule.origin].y;
                    } else {
                        rule["origin-x"] = parseInt(allInterface[rule.origin].x) + parseInt(allInterface[rule.origin].parent_vnf_x);
                        rule["origin-y"] = parseInt(allInterface[rule.origin].y) + parseInt(allInterface[rule.origin].parent_vnf_y);

                    }
                    if (rule.destination.indexOf("endpoint") > -1) {
                        rule["destination-x"] = allInterface[rule.destination].x;
                        rule["destination-y"] = allInterface[rule.destination].y;
                    } else {
                        rule["destination-x"] = parseInt(allInterface[rule.destination].x) + parseInt(allInterface[rule.destination].parent_vnf_x);
                        rule["destination-y"] = parseInt(allInterface[rule.destination].y) + parseInt(allInterface[rule.destination].parent_vnf_y);

                    }
                    flowRules.push(rule);
                });
            });

            var links = graph.connections.selectAll(".link")
                .data(flowRules, function (d) {
                    return d.origin + ";" + d.destination;
                });
            links
                .enter()
                .append("line")
                .attr("class", "link line normaleView")
                .attr("stroke", "black");
            links
                .attr("x1", function (d) {
                    return parseInt(d["origin-x"]);
                })
                .attr("y1", function (d) {
                    return parseInt(d["origin-y"]);
                })
                .attr("x2", function (d) {
                    return parseInt(d["destination-x"]);
                })
                .attr("y2", function (d) {
                    return parseInt(d["destination-y"]);
                })
                .attr("id", function (d) {
                    return "fr-" + d.origin + ";" + d.destination;
                })
                .attr("title", function (d) {
                    return "Source: " + d.origin + " Action: " + d.destination;
                })
                //aggiungo l'info da chi parte a chi arriva
                .attr("start", function (d) {
                    return d.origin;
                })
                .attr("end", function (d) {
                    return d.destination;
                })
                .attr("fullduplex", function (d) {
                    return d.isFullDuplex;
                })
                .attr("marker-end", function (d) {
                    //return d.full_duplex == false ? "url(#EPArrow)" : "default";
                    if (d.isFullDuplex === true)
                        return "default";
                    else
                        return "url(#Arrow)";
                })
            //.on("click", selectSimpleLines);
            links.exit().remove();
        };
        var _buildBigSwitchLink = function (fg, pos, graph) {
            //linkare end point e interfacce alle rispettive controparti nel big-switch

            var BSinterfaces = [];

            angular.forEach(pos["big-switch"].interfaces, function (int) {
                BSinterfaces.push(int);
            });

            var externalLink = graph.connections.selectAll(".externalLink")
                .data(BSinterfaces, function (d) {
                    return d.id;
                });
            externalLink.enter()
                .append("line")
                .attr("class", "externalLink bigSwitchView")
                .attr("stroke", "black");
            externalLink
                .attr("x1", function (d) {
                    return parseInt(pos["big-switch"].x + d.x)
                })
                .attr("y1", function (d) {
                    return parseInt(pos["big-switch"].y + d.y)
                })
                .attr("x2", function (d) {
                    if (d.id.indexOf("endpoint") >= 0) {
                        return parseInt(pos["end-points"][d.parent_ep_id].x)
                    } else {
                        return parseInt(pos["VNFs"][d.parent_vnf_id].x + pos["VNFs"][d.parent_vnf_id].ports[d.parent_vnf_port].x)
                    }

                })
                .attr("y2", function (d) {
                    if (d.id.indexOf("endpoint") >= 0) {
                        return parseInt(pos["end-points"][d.parent_ep_id].y)
                    } else {
                        return parseInt(pos["VNFs"][d.parent_vnf_id].y + pos["VNFs"][d.parent_vnf_id].ports[d.parent_vnf_port].y)
                    }
                })
                .attr("id", function (d) {
                    return "ExtLink-" + d.id;
                })
            /*.on("click",select_node)
             .call(drag_INTERFACEBIGSWITCH);*/
            externalLink.exit().remove();

            var flowRules = [];
            angular.forEach(pos["big-switch"]["flow-rules"], function (origin) {
                angular.forEach(origin, function (rule) {
                    flowRules.push(rule);
                });
            });

            var internalLinks = graph.connections.selectAll(".internalLink")
                .data(flowRules, function (d) {
                    return d.origin + ";" + d.destination;
                });
            internalLinks
                .enter()
                .append("line")
                .attr("class", "internalLink line bigSwitchView")
                .attr("stroke", "black");
            internalLinks
                .attr("x1", function (d) {
                    return parseInt(pos["big-switch"].x + pos["big-switch"]["interfaces"][d.origin].x);
                })
                .attr("y1", function (d) {
                    return parseInt(pos["big-switch"].y + pos["big-switch"]["interfaces"][d.origin].y);
                })
                .attr("x2", function (d) {
                    return parseInt(pos["big-switch"].x + pos["big-switch"]["interfaces"][d.destination].x);
                })
                .attr("y2", function (d) {
                    return parseInt(pos["big-switch"].y + pos["big-switch"]["interfaces"][d.destination].y);
                })
                .attr("idfr", function (d) {
                    return "fr-int-" + d.origin + ";" + d.destination;
                })
                .attr("title", function (d) {
                    if (d.full_duplex == true) {
                        /* Bidirectional link */
                        return d.origin + "<br><i class='fa fa-exchange'></i><br>" + d.destination;
                    } else {
                        /* Unidirectional link */
                        return d.origin + "<br><i class='fa fa-long-arrow-right'></i><br>" + d.destination;
                    }
                })
                //aggiungo l'info da chi parte a chi arriva
                .attr("start", function (d) {
                    return d.origin;
                })
                .attr("end", function (d) {
                    return d.destination;
                })
                .attr("fullduplex", function (d) {
                    return d.isFullDuplex;
                })
                .attr("marker-end", function (d) {
                    if (d.isFullDuplex === true)
                        return "default";
                    else
                        return "url(#InternalArrow)";
                })
            //.on("click", selectSimpleLines);
            internalLinks.exit().remove();

        };

        var _buildAllLink = function (fg, pos, graph) {
            _buildLink(fg, pos, graph);
            _buildBigSwitchLink(fg, pos, graph);
        };

        return {
            buildEPs: _buildEPs,
            buildVNFs: _buildVNFs,
            buildBigSwitch: _buildBigSwitch,
            buildLink: _buildLink,
            buildBigSwitchLink: _buildBigSwitchLink,
            buildAllLink: _buildAllLink
        }
    };
    fgDrawService.$inject = ['graphConstant', 'fgDragService'];

    angular.module('d3').service('fgDrawService', fgDrawService);
})();