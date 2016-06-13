/**
 * Created by giacomo on 30/05/16.
 */
(function () {
    "use strict";
    /**
     * Service to draw element in the graph
     * @param graphConstant The constant used in the graph directive as parameter
     * @returns {{buildEPs: _buildEPs, buildVNFs: _buildVNFs, buildBigSwitch: _buildBigSwitch, buildLink: _buildLink, buildBigSwitchLink: _buildBigSwitchLink, buildAllLink: _buildAllLink}}
     */
    var fgDrawService = function (graphConstant) {
        /**
         * Function to draw the EPs on the graph
         * @param endpoints The portion  of the forwarding graph for the end points fg["end-points"]
         * @param pos The portion of the position structure for the end points fgPos["end-points"]
         * @param graph the graph container of the directive
         * @private
         */
        function _buildEPs(endpoints, pos, graph) {

            var alfa = 2 * Math.PI / endpoints.length;
            //selection of all end-point in the graph and association with end-points of the json
            var epElements = graph.interfaces.selectAll(".end-points")
                .data(endpoints, function (d) {
                    //this function is used to identify each item
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
                    return pos[d.id].full_id; //id of the element
                })
                .attr("title", function (d) {
                    return d.name;  //title of the element, used to display tips
                })
                .attr("class", function (d) {
                    return "end-points " + d.name; // "end-points" class is the one used for selection in the first step of this function
                })
                .attr("cx", function (d, i) {   // x position of the center of the element
                    if (typeof pos[d.id].x == "number")//if position exist
                        return pos[d.id].x;
                    else
                    //is calculated disposing ina  circle and normalizing to the center of the graph
                        return pos[d.id].x = parseInt(250 * Math.cos(alfa * (i)) + graph.svg.node().getBoundingClientRect().width / 2)

                })
                .attr("cy", function (d, i) {   // y position of the center of the element
                    if (typeof pos[d.id].y == "number")//if position exist
                        return pos[d.id].y;
                    else
                    //is calculated disposing ina  circle and normalizing to the center of the graph
                        return pos[d.id].y = parseInt(250 * Math.sin(alfa * (i)) + graph.svg.node().getBoundingClientRect().height / 2)
                })
                .call(graph.drag.epDrag) //adding drag functionality
            /*.on("click",selectEndPoints)
             .on("contextmenu",function(d){
             d3.event.preventDefault();
             showEditInfoEP(d.id);
             });*/
            //operation on element going out of the collection
            epElements.exit().remove();

        }

        /**
         * Function to draw the VNFs in the graph and its ports
         * @param vnfs The portion  of the forwarding graph for the vnfs fg["VNFs"]
         * @param pos The portion of the position structure for the vnfs fgPos["VNFs"]
         * @param graph The graph container of the directive
         * @private
         */
        function _buildVNFs(vnfs, pos, graph) {
            var alfa = 2 * Math.PI / vnfs.length;
            //selection of all vnfs in the graph and association with vnf of the json
            var vnfElements = graph.vnfs.selectAll(".vnf")
                .data(vnfs, function (d) {
                    //this function is used to identify each item
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
                    return pos[d.id].full_id;    //id of the element
                })
                .attr("x", function (d, i) {    // x position of the element
                    if (typeof pos[d.id].x == "number")//if exist as number use the existing position
                        return pos[d.id].x;
                    else { //else calculate it
                        var limit = graph.svg.node().getBoundingClientRect().width / 2
                            - graphConstant.vnfWidth / 2;
                        //limit is the size of the circle in which we distribute the item
                        //10 is subtracted to make distance from border
                        var xCenter = (limit - 10) * Math.cos(alfa * (i) + Math.PI / 2);
                        //position is then normalized and saved (center moved to middle of graph
                        return pos[d.id].x = parseInt(xCenter + limit);
                    }

                })
                .attr("y", function (d, i) {    // y position of the element
                    if (typeof pos[d.id].y == "number")
                        return pos[d.id].y;//if exist as number use the existing position
                    else { //else calculate it
                        var limit = graph.svg.node().getBoundingClientRect().height / 2
                            - graphConstant.vnfHeigth / 2;
                        //limit is the size of the circle in which we distribute the item
                        //10 is subtracted to make distance from border
                        var yCenter = (limit - 10) * Math.sin(alfa * (i) + Math.PI / 2);
                        //position is then normalized and saved (center moved to middle of graph
                        return pos[d.id].y = parseInt(yCenter + limit);

                    }
                })
                .call(graph.drag.vnfDrag) //adding drag functionality
            /*.on("mousedown", selectVNFs)
             .on("contextmenu", function (d) {
             d3.event.preventDefault();
             showEditInfoVNF(d.id);
             });*/

            //operation on element going out of the collection
            vnfElements.exit().remove();

            //selection of all vnf-text item
            var vnfTextElements = graph.vnfsText.selectAll(".vnf-text")
                .data(vnfs, function (d) {
                    //this function is used to identify each item
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
                    return "text_" + pos[d.id].full_id; //id of the element
                })
                .attr("x", function (d) {   // x position of the element
                    return parseInt(pos[d.id].x + graphConstant.vnfWidth / 2)
                })
                .attr("y", function (d) {   // y position of the element
                    return parseInt(pos[d.id].y + graphConstant.vnfHeigth / 2 + 4)
                })
                .text(function (d) {
                    //text inside the vnf ( is a separate element that follow the vnf
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
                    //this function is used to identify each item
                    return d.full_id;
                });
            portElements
                .enter()
                .append("circle")
                .attr("r", graphConstant.ifRadius)  //radius of the circle element
                .attr("class", "interface vnf-interface"); // "vnf-interface" is the class used for selection
            portElements
                .attr("id", function (d) {
                    return d.full_id; //id of the element
                })
                .attr("title", function (d) {
                    return d.full_id;  //title of the element, used to display tips
                })
                .attr("cx", function (d, i) {   // x position of the center of the element
                    var portPos = pos[d.parent].ports[d.port.id];
                    portPos.parent_vnf_x = pos[d.parent].x;
                    if (typeof portPos.x != "number") {//if x position has not been calculated yet
                        //the algorithm distribute the interface equally across one side
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
                    if (typeof portPos.y != "number")//if position has not been calculated yet
                    //it's positioned in the long side near the center
                        portPos.y = parseInt(portPos.parent_vnf_y < graph.svg.node().getBoundingClientRect().height / 2 ? graphConstant.vnfHeigth : 0);
                    return parseInt(portPos.y + portPos.parent_vnf_y);
                })
                .attr("parent_NF_position_x", function (d) {
                    return pos[d.parent].x; // x position of the parent vnf probably to be deleted
                })
                .attr("parent_NF_position_y", function (d) {
                    return pos[d.parent].y; // y position of the parent vnf probably to be deleted
                })
                .attr("parent", function (d) {
                    return pos[d.parent].full_id;    // id of the parent vnf
                })
                .call(graph.drag.vnfPortDrag) //adding drag functionality
            /*.on("click", select_node);*/
            //operation on element going out of the collection
            portElements.exit().remove()
        }

        /***
         * This function is used to calculate the position of the interface along the bigSwitch
         * @param element referring ep or vnf
         * @param bs the big switch
         * @param port referring port of the vnf
         * @returns {{}} relative coordinates of the interface
         * @private
         */
        function _getPos(element, bs, port) {
            var pos = {};

            var xPos = element.x;
            var yPos = element.y;
            //if port element is passed means it's a vnf port so the x position of the referring element is a sum of the vnf and port relative position
            if (port) {
                xPos += port.x;
                yPos += port.y;
            }
            //if the x position is outside of the big switch position the interface is positioned on the edge
            if (xPos < bs.x)
                pos.x = bs.x;
            else if (xPos > bs.x + graphConstant.bigSwitchWidth)
                pos.x = bs.x + graphConstant.bigSwitchWidth;
            else // else is positioned with the same x as the referring element
                pos.x = xPos;

            //if the y position is outside of the big switch position the interface is positioned on the edge
            if (yPos < bs.y)
                pos.y = bs.y;
            else if (yPos > bs.y + graphConstant.bigSwitchHeight)
                pos.y = bs.y + graphConstant.bigSwitchHeight;
            else // else is positioned with the same y as the referring element
                pos.y = yPos;

            pos.x = parseInt(pos.x - bs.x);
            pos.y = parseInt(pos.y - bs.y);

            return pos;
        }

        /**
         * Function to draw the big-switch and its interface
         * @param bigswitch The portion  of the forwarding graph for the big switch fg["big-switch"]
         * @param pos The portion of the position structure for the big switch fgPos["big-switch"]
         * @param vnfPos The portion of the position structure for the vnf fgPos["VNFs]
         * @param epPos The portion of the position structure for the end points fgPos["end-points"]
         * @param graph The graph container of the directive
         * @private
         */
        function _buildBigSwitch(bigswitch, pos, vnfPos, epPos, graph) {
            // because the big switch is only one it's encapsulated in an array alone
            var bigswitchElement = graph.bigSwitch.selectAll(".big-switch")
                .data([bigswitch]);
            // the first time is executed it's drawn
            bigswitchElement
                .enter()
                .append("use")
                .style("stroke-dasharray", ("8, 4"))
                .attr("xlink:href", "#BIG_SWITCH") // use bigswitch definition as template
                .attr("class", "big-switch bigSwitchView");//class bigSwitchView is used to change the display mode
            bigswitchElement
                .attr("x", function () { // x position of the big switch
                    if (typeof pos.x == "number") //if the position is already defined use it
                        return pos.x;
                    else // other whise put it into the middle
                        return pos.x = graph.svg.node().getBoundingClientRect().width / 2 - graphConstant.bigSwitchWidth / 2;
                })
                .attr("y", function () { // y position of the big switch
                    if (typeof pos.y == "number") //if the position is already defined use it
                        return pos.y;
                    else // other whise put it into the middle
                        return pos.y = graph.svg.node().getBoundingClientRect().height / 2 - graphConstant.bigSwitchHeight / 2;
                })
                .call(graph.drag.bigSwitchDrag)
            /*.on("click", selectBS);*/

            //the d3 library needs an array, so the position are extracted from the object
            var interfaces = [];
            angular.forEach(pos.interfaces, function (int) {
                interfaces.push(int);
            });

            var bigswitchInterfaceElement = graph.interfaces.selectAll(".bs-interface")
                .data(interfaces, function (d) {
                    //this function is used to identify each item
                    return d.id;
                });
            bigswitchInterfaceElement.enter()
                .append("circle")
                .attr("id", "big-switch")
                .attr("r", graphConstant.ifRadius)//radius of the circle
                .attr("class", "bs-interface interface bigSwitchView");// class bigSwitchView is used to identify the element displayed only in complex view
            bigswitchInterfaceElement
                .attr("cx", function (d) {//x position of the circle
                    if (typeof d.x != "number") //if the position is not defined calculate it
                        if (d.parent_vnf_id) // if is vnf interface
                            d.x = _getPos(vnfPos[d.parent_vnf_id], pos, vnfPos[d.parent_vnf_id].ports[d.parent_vnf_port]).x;
                        else
                            d.x = _getPos(epPos[d.parent_ep_id], pos).x;
                    return parseInt(pos.x + d.x);
                })
                .attr("cy", function (d) {//y position of the circle
                    if (typeof d.y != "number") //if the position is not defined calculate it
                        if (d.parent_vnf_id)//if is vnf interface
                            d.y = _getPos(vnfPos[d.parent_vnf_id], pos, vnfPos[d.parent_vnf_id].ports[d.parent_vnf_port]).y;
                        else
                            d.y = _getPos(epPos[d.parent_ep_id], pos).y;
                    return parseInt(pos.y + d.y);
                })
                .call(graph.drag.bigSwitchInterfaceDrag)
            /*.on("click",select_node);*/
            bigswitchInterfaceElement.exit().remove();
        }

        /**
         * Function to draw link between element of the graph in normal view
         * @param pos The forwarding graph information about the position of the element
         * @param graph The graph container of the directive
         * @private
         */
        function _buildLink(pos, graph) {
            //enumerating all the interface( vnfs ports and end-points )
            var allInterface = {};
            angular.forEach(pos["VNFs"], function (vnf) {
                angular.forEach(vnf["ports"], function (port) {
                    allInterface[port.full_id] = port;
                });
            });
            angular.forEach(pos["end-points"], function (ep) {
                allInterface[ep.full_id] = ep;
            });
            //transforming into array of flow rules for the d3 library
            var flowRules = [];
            angular.forEach(pos["big-switch"]["flow-rules"], function (origin) {
                angular.forEach(origin, function (rule) {
                    //set origin position
                    if (rule.origin.indexOf("endpoint") > -1) {//if is endpoint
                        rule["origin-x"] = parseInt(allInterface[rule.origin].x);
                        rule["origin-y"] = parseInt(allInterface[rule.origin].y);
                    } else {
                        rule["origin-x"] = parseInt(allInterface[rule.origin].x + allInterface[rule.origin].parent_vnf_x);
                        rule["origin-y"] = parseInt(allInterface[rule.origin].y + allInterface[rule.origin].parent_vnf_y);

                    }
                    //set destination position
                    if (rule.destination.indexOf("endpoint") > -1) { //if is endpoint
                        rule["destination-x"] = parseInt(allInterface[rule.destination].x);
                        rule["destination-y"] = parseInt(allInterface[rule.destination].y);
                    } else {
                        rule["destination-x"] = parseInt(allInterface[rule.destination].x + allInterface[rule.destination].parent_vnf_x);
                        rule["destination-y"] = parseInt(allInterface[rule.destination].y + allInterface[rule.destination].parent_vnf_y);

                    }
                    flowRules.push(rule);
                });
            });

            var links = graph.connections.selectAll(".link")
                .data(flowRules, function (d) {
                    //this function is used to identify each item
                    return d.origin + ";" + d.destination;
                });
            links
                .enter()
                .append("line")
                .attr("class", "link line normalView")// class normalView is used to identify the element displayed only in standard view
                .attr("stroke", "black");
            links
                .attr("id", function (d) {
                    return "fr-" + d.origin + ";" + d.destination;    //id of the element
                })
                .attr("title", function (d) {
                    return "Source: " + d.origin + " Action: " + d.destination;  //title of the element, used to display tips
                })
                .attr("x1", function (d) {
                    return parseInt(d["origin-x"]);// origin x
                })
                .attr("y1", function (d) {
                    return parseInt(d["origin-y"]);// origin y
                })
                .attr("x2", function (d) {
                    return parseInt(d["destination-x"]);// destination x
                })
                .attr("y2", function (d) {
                    return parseInt(d["destination-y"]);//destination y
                })
                .attr("start", function (d) {
                    return d.origin; // point of origin
                })
                .attr("end", function (d) {
                    return d.destination; //point of destination
                })
                .attr("fullduplex", function (d) {
                    return d.isFullDuplex;
                })
                .attr("marker-end", function (d) {//the end marker, arrow if half duplex (big if end into endpoint)
                    return d.isFullDuplex === true ? "default" : d.destination.indexOf("endpoint") == -1?"url(#interfaceArrow)":"url(#EndpointArrow)";
                })
            //.on("click", selectSimpleLines);
            links.exit().remove();
        }

        /**
         * Function to draw link in complex mode, inside the big switch
         * @param pos The forwarding graph information about the position of the element
         * @param graph The graph container of the directive
         * @private
         */
        function _buildBigSwitchLink(pos, graph) {
            // listing all bigswitch interface for the d3 library
            var BSinterfaces = [];
            angular.forEach(pos["big-switch"].interfaces, function (int) {
                BSinterfaces.push(int);
            });

            // drawing all link from the port/endpoint to the corresponding interface in the big switch
            var externalLink = graph.connections.selectAll(".externalLink")
                .data(BSinterfaces, function (d) {
                    //this function is used to identify each item
                    return d.id;
                });
            externalLink.enter() //adding new element
                .append("line")
                .attr("class", "externalLink bigSwitchView")// class bigSwitchView is used to identify the element displayed only in complex view
                .attr("stroke", "black");
            externalLink //operation on updating and entering element of the list
                .attr("id", function (d) {
                    return "ExtLink-" + d.id;    //id of the element
                })
                .attr("x1", function (d) {
                    return parseInt(pos["big-switch"].x + d.x); // x of point of origin(interface of the big switch)
                })
                .attr("y1", function (d) {
                    return parseInt(pos["big-switch"].y + d.y); // y of point of origin(interface of the big switch)
                })
                .attr("x2", function (d) { // x of point of destination(end point/vnf port)
                    if (d.id.indexOf("endpoint") >= 0) { // if is end point
                        return parseInt(pos["end-points"][d.parent_ep_id].x)
                    } else {
                        return parseInt(pos["VNFs"][d.parent_vnf_id].x + pos["VNFs"][d.parent_vnf_id].ports[d.parent_vnf_port].x)
                    }

                })
                .attr("y2", function (d) { // y of point of destination(end point/vnf port)
                    if (d.id.indexOf("endpoint") >= 0) { //if is end point
                        return parseInt(pos["end-points"][d.parent_ep_id].y)
                    } else {
                        return parseInt(pos["VNFs"][d.parent_vnf_id].y + pos["VNFs"][d.parent_vnf_id].ports[d.parent_vnf_port].y)
                    }
                });
            externalLink.exit().remove();

            //listing the flow rules for internal use with d3
            var flowRules = [];
            angular.forEach(pos["big-switch"]["flow-rules"], function (origin) {
                angular.forEach(origin, function (rule) {
                    flowRules.push(rule);
                });
            });
            var internalLinks = graph.connections.selectAll(".internalLink")
                .data(flowRules, function (d) {
                    //this function is used to identify each item
                    return d.origin + ";" + d.destination;
                });
            internalLinks
                .enter()
                .append("line")
                .attr("class", "internalLink line bigSwitchView")// class bigSwitchView is used to identify the element displayed only in complex view
                .attr("stroke", "black");
            internalLinks
                .attr("id", function (d) {
                    return "fr-int-" + d.origin + ";" + d.destination; ///id of the element
                })
                .attr("title", function (d) {
                    //title of the element, used to display tips
                    if (d.full_duplex == true) {
                        /* Bidirectional link */
                        return d.origin + "<br><i class='fa fa-exchange'></i><br>" + d.destination;
                    } else {
                        /* Unidirectional link */
                        return d.origin + "<br><i class='fa fa-long-arrow-right'></i><br>" + d.destination;
                    }
                })
                .attr("x1", function (d) {
                    return parseInt(pos["big-switch"].x + pos["big-switch"]["interfaces"][d.origin].x); // x of the origin corresponding interface
                })
                .attr("y1", function (d) {
                    return parseInt(pos["big-switch"].y + pos["big-switch"]["interfaces"][d.origin].y); // y of the origin corresponding interface
                })
                .attr("x2", function (d) {
                    return parseInt(pos["big-switch"].x + pos["big-switch"]["interfaces"][d.destination].x); // x of the destination corresponding interface
                })
                .attr("y2", function (d) {
                    return parseInt(pos["big-switch"].y + pos["big-switch"]["interfaces"][d.destination].y); // y of the destination corresponding interface
                })
                .attr("start", function (d) {
                    return d.origin; //point of origin
                })
                .attr("end", function (d) {
                    return d.destination; //point of destination
                })
                .attr("fullduplex", function (d) {
                    return d.isFullDuplex;
                })
                .attr("marker-end", function (d) {
                    return d.isFullDuplex === true ? "default" : "url(#InterfaceArrow)"; //marker is arrow if half duplex
                })
            //.on("click", selectSimpleLines);
            internalLinks.exit().remove();

        }

        /**
         * Function to draw all the link
         * @param fg The forwarding graph instance
         * @param pos The forwarding graph information about the position of the element
         * @param graph The graph container of the directive
         * @private
         */
        function _buildAllLink(pos, graph) {
            _buildLink(pos, graph);
            _buildBigSwitchLink(pos, graph);
        }

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