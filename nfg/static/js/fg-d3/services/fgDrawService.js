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
                    if (pos[d.id].x)
                        return pos[d.id].x;
                    else
                        return pos[d.id].x = parseInt(250 * Math.cos(alfa * (i)) + graph.svg.node().getBoundingClientRect().width / 2)

                })
                .attr("cy", function (d, i) {   // y position of the center of the element
                    if (pos[d.id].y)
                        return pos[d.id].y;
                    else
                        return pos[d.id].y = parseInt(250 * Math.sin(alfa * (i)) + graph.svg.node().getBoundingClientRect().height / 2)
                })
            /*.on("click",selectEndPoints)
             .on("contextmenu",function(d){
             d3.event.preventDefault();
             showEditInfoEP(d.id);
             })
             .call(drag_EP);*/
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
                    if (pos[d.id].x)
                        return pos[d.id].x;
                    else
                        return pos[d.id].x = parseInt(200 * Math.cos(alfa * (i) + Math.PI / 2) +
                            graph.svg.node().getBoundingClientRect().width / 2 -
                            graphConstant.vnfWidth / 2 - graphConstant.offsetX / 2)
                })
                .attr("y", function (d, i) {    // y position of the element
                    if (pos[d.id].y)
                        return pos[d.id].y;
                    else
                        return pos[d.id].y = parseInt(200 * Math.sin(alfa * (i) + Math.PI / 2) +
                            graph.svg.node().getBoundingClientRect().height / 2 -
                            graphConstant.vnfHeigth / 2 - graphConstant.offsetY / 2)
                })
            /*.on("mousedown", selectVNFs)
             .on("contextmenu", function (d) {
             d3.event.preventDefault();
             showEditInfoVNF(d.id);
             })
             .call(drag_NF);*/
            //operation on element going out of the collection
            vnfElements.exit().remove();

            var vnfTextElements = graph.vnfsText.selectAll(".vnf-text")
                .data(vnfs, function (d) {
                    return d.id;
                });
            vnfTextElements
                .enter()
                .append("text")
                .attr("class", "vnf-text")
                .attr("text-anchor", "middle")
                .attr("fill", "white");
            //operation on updated and new element
            vnfTextElements
                .attr("id", function (d) {
                    return "text_" + pos[d.id].full_id;
                })
                .attr("x", function (d) {   // x position of the element
                    return pos[d.id].x + graphConstant.vnfWidth / 2;
                })
                .attr("y", function (d) {   // y position of the element
                    return pos[d.id].y + graphConstant.vnfHeigth / 2 + 4;
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
                    return "vnf:" + pos[d.parent].ports[d.port.id].parent_vnf_id + ":" + pos[d.parent].ports[d.port.id].id;
                })
                .attr("title", function (d) {
                    return pos[d.parent].ports[d.port.id].full_id;
                })
                .attr("cx", function (d) {   // x position of the center of the element
                    if (!pos[d.parent].ports[d.port.id].x)
                        pos[d.parent].ports[d.port.id].x = parseInt(Math.random() * graphConstant.vnfWidth);
                    if (!pos[d.parent].ports[d.port.id].parent_vnf_x)
                        pos[d.parent].ports[d.port.id].parent_vnf_x = pos[d.parent].x;
                    return parseInt(pos[d.parent].ports[d.port.id].x) + parseInt(pos[d.parent].ports[d.port.id].parent_vnf_x);
                })
                .attr("cy", function (d) {   // y position of the center of the element
                    if (!pos[d.parent].ports[d.port.id].y)
                        pos[d.parent].ports[d.port.id].y = 0;
                    if (!pos[d.parent].ports[d.port.id].parent_vnf_y)
                        pos[d.parent].ports[d.port.id].parent_vnf_y = pos[d.parent].y;
                    return parseInt(pos[d.parent].ports[d.port.id].y) + parseInt(pos[d.parent].ports[d.port.id].parent_vnf_y);
                })
                .attr("parent_NF_position_x", function (d) {
                    return pos[d.parent].ports[d.port.id].parent_vnf_x; // x position of the parent vnf
                })
                .attr("parent_NF_position_y", function (d) {
                    return pos[d.parent].ports[d.port.id].parent_vnf_y; // y position of the parent vnf
                })
                .attr("parent", function (d) {
                    return "vnf:" + pos[d.parent].ports[d.port.id].parent_vnf_id;    // id of the parent vnf
                })
            /*.on("click", select_node);
             .call(drag_INTERFACE)*/
            //operation on element going out of the collection
            portElements.exit().remove()
        };

        var _getPos = function (vnf, bs) {
            var pos = {};
            var m1 = {
                x: bs.x,
                y: bs.y + graphConstant.bigSwitchHeight / 2
            }, m2 = {
                x: bs.x + graphConstant.bigSwitchWidth,
                y: bs.y + graphConstant.bigSwitchHeight / 2
            }, m3 = {
                x: bs.x + graphConstant.bigSwitchWidth / 2,
                y: bs.y
            }, m4 = {
                x: bs.x + graphConstant.bigSwitchWidth / 2,
                y: bs.y + graphConstant.bigSwitchHeight
            };

            var d1 = Math.pow(vnf.x - m1.x, 2) + Math.pow(vnf.y - m1.y, 2);
            var d2 = Math.pow(vnf.x - m2.x, 2) + Math.pow(vnf.y - m2.y, 2);
            var d3 = Math.pow(vnf.x - m3.x, 2) + Math.pow(vnf.y - m3.y, 2);
            var d4 = Math.pow(vnf.x - m4.x, 2) + Math.pow(vnf.y - m4.y, 2);
            var min = Math.min(d1, d2, d3, d4);
            switch (min) {
                case d1:
                    if (vnf.y < bs.y) {
                        pos.y = bs.y;
                    } else if (vnf.y > bs.y + graphConstant.bigSwitchHeight) {
                        pos.y = bs.y + graphConstant.bigSwitchHeight;
                    } else {
                        pos.y = vnf.y;
                    }
                    pos.x = bs.x;
                    break;
                case d2:
                    if (vnf.y < bs.y) {
                        pos.y = bs.y;
                    } else if (vnf.y > bs.y + graphConstant.bigSwitchHeight) {
                        pos.y = bs.y + graphConstant.bigSwitchHeight;
                    } else {
                        pos.y = vnf.y;
                    }
                    pos.x = bs.x + graphConstant.bigSwitchWidth;
                    break;
                case d3:
                    if (vnf.x < bs.x) {
                        pos.x = bs.x;
                    } else if (vnf.x > bs.x + graphConstant.bigSwitchWidth) {
                        pos.x = bs.x + graphConstant.bigSwitchWidth;
                    } else {
                        pos.x = vnf.x;
                    }
                    pos.y = bs.y;
                    break;
                case d4:
                    if (vnf.x < bs.x) {
                        pos.x = bs.x;
                    } else if (vnf.x > bs.x + graphConstant.bigSwitchWidth) {
                        pos.x = bs.x + graphConstant.bigSwitchWidth;
                    } else {
                        pos.x = vnf.x;
                    }
                    pos.y = bs.y + graphConstant.bigSwitchHeight;
                    break;
            }
            pos.x -= bs.x;
            pos.y -= bs.y;
            return pos;
        };

        var _buildBigSwitch = function (bigswitch, pos, vnfPos, epPos, graph) {
            var bigswitchElement = graph.bigSwitch.selectAll(".big-switch")
                .data([bigswitch]);
            bigswitchElement
                .enter()
                .append("use")
                .style("stroke-dasharray", ("8, 4"))
                .attr("xlink:href", "#BIG_SWITCH")
                .attr("class", "big-switch");
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
            /*.on("click", selectBS)
             .call(drag_BIGSWITCH);*/

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
                .attr("class", "bs-interface interface");
            bigswitchInterfaceElement
                .attr("cx", function (d) {
                    if (!d.x)
                        if (d.parent_vnf_id)
                            d.x = _getPos(vnfPos[d.parent_vnf_id], pos).x;
                        else
                            d.x = _getPos(epPos[d.parent_ep_id], pos).x;
                    return pos.x + d.x;
                })
                .attr("cy", function (d) {
                    if (!d.y)
                        if (d.parent_vnf_id)
                            d.y = _getPos(vnfPos[d.parent_vnf_id], pos).y;
                        else
                            d.y = _getPos(epPos[d.parent_ep_id], pos).y;
                    return pos.y + d.y;
                })
            /*.on("click",select_node)
             .call(drag_INTERFACEBIGSWITCH);*/
            bigswitchInterfaceElement.exit().remove();
        };

        var _buildLink = function () {

        };
        var _buildBigSwitchLink = function () {

        };

        return {
            buildEPs: _buildEPs,
            buildVNFs: _buildVNFs,
            buildBigSwitch: _buildBigSwitch,
            buildLink: _buildLink,
            buildBigSwitchLink: _buildBigSwitchLink
        }
    };
    fgDrawService.$inject = ['graphConstant'];

    angular.module('d3').service('fgDrawService', fgDrawService);
})();