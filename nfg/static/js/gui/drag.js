/**
 * This file contains the drag functions for all the graphical objects: NetworkFunctions, EndPoint, Network Function's Interfaces and
 * Big Switch's Interfaces.
 * As always changing the graphical object means also change the JS object that is referred.
 *
 * If you whant to put another graphical object you should implement here you own drag and drop function.
 *
 **/
//VNF
function dragNF(){
    var drag_NF = d3.behavior.drag()
        .on("drag",function(d) {
            //at drag the VNF will be with its center to the mouse position (d3.event.x and .y)
            var x=parseInt(d3.event.x)-NF_width/2-NF_offset_x,
                y=parseInt(d3.event.y)-NF_height/2-NF_offset_y;
            var VNF= d3.select(this);
            //change the graphical object
            VNF.attr("x",x).attr("y",y);
            //change the JS object
            var VNF_js=getVNFById(VNF.attr("id")); VNF_js.x=x;VNF_js.y=y;
            //now for all his VNF interfaces the new position is equals to the VNF current position plus the original offset of the interface
            //on the VNF itself
            svg.selectAll(".interface[parent=vnf"+VNF.attr("id")+"]")[0].forEach(function(e){
                var interface=d3.select(e);
                var interface_js=getInterfaceById(interface.attr("id"));
                interface_js.parent_NF_x=x;interface_js.parent_NF_y=y;
                interface.attr("cx",parseInt(interface_js.x)+x);
                interface.attr("cy",parseInt(interface_js.y)+y);
                //set the new parent_NF_position
                interface.attr("parent_NF_position_x",x);
                interface.attr("parent_NF_position_y",y);
                //change the JS vnf port object
                var pos=interface.attr("id").replace(/:/g,"\\:");
                var link1=svg.selectAll("[start="+pos+"]");
                if(link1[0].length!==0){
                    link1.attr("x1",interface_js.x+x)
                        .attr("y1",interface_js.y+y)
                }
                var link2=svg.selectAll("[end="+pos+"]");
                if(link2[0].length!==0){
                    link2.attr("x2",interface_js.x+x)
                        .attr("y2",interface_js.y+y)
                }
            });
            //change the position of the text
            VNF_text_section.select("#text_"+VNF.attr("id")).attr("x",x+20).attr("y",y+5+NF_height/2);

        })
    return drag_NF;
}
// Big Switch
function dragBIGSWITCH(){
    var drag_BIGSWITCH = d3.behavior.drag()
        .on("drag",function(d) {
            //at drag the BS will be with its center to the mouse position (d3.event.x and .y)
            var x=parseInt(d3.event.x)-BIG_SWITCH_width/2-NF_offset_x,
                y=parseInt(d3.event.y)-BIG_SWITCH_height/2-NF_offset_y;
            var BIG= d3.select(this);
            //change the graphical object
            BIG.attr("x",x+NF_offset_x).attr("y",y+NF_offset_y);
            //change the JS object
            big_switch.x=x;big_switch.y=y;
            //now for all his VNF interfaces the new position is equals to the VNF current position plus the original offset of the interface
            //on the VNF itself
            svg.selectAll(".BS_interface")[0].forEach(function(e){
                var interface=d3.select(e);
                var interface_js = getBSInterfaceById(interface.attr("id"));
                interface.attr("cx",interface_js.x+x);
                interface.attr("cy",interface_js.y+y);
                var pos=interface.attr("id").replace(/:/g,"\\:");
                var link1=svg.selectAll("[start=bs-"+pos+"]");
                if(link1[0].length!==0){
                    link1.attr("x1",interface_js.x+x)
                        .attr("y1",interface_js.y+y)
                }
                var link2=svg.selectAll("[end=bs-"+pos+"]");
                if(link2[0].length!==0){
                    link2.attr("x2",interface_js.x+x)
                        .attr("y2",interface_js.y+y)
                }
            });

        });

    return drag_BIGSWITCH;
}
// End Point
function dragEP(){
    var drag_EP = d3.behavior.drag()
        .on("drag",function(d){
            var cx=parseInt(d3.event.x),cy=parseInt(d3.event.y);
            var interface = d3.select(this);
            interface.attr("cx",cx).attr("cy",cy);
            var EP_js=getEndPointById(interface.attr("id"));
            EP_js.x=cx;EP_js.y=cy;
            var link1=svg.selectAll("[start=endpoint\\:"+interface.attr("id")+"]");
            if(link1[0].length!==0){
                link1.attr("x1",parseInt(interface.attr("cx")))
                    .attr("y1",parseInt(interface.attr("cy")))
            }
            var link2=svg.selectAll("[end=endpoint\\:"+interface.attr("id")+"]");
            if(link2[0].length!==0){
                link2.attr("x2",parseInt(interface.attr("cx")))
                    .attr("y2",parseInt(interface.attr("cy")))
            }
        }).on("dragstart",function(d){
            d3.event.sourceEvent.stopPropagation();
        });
    return drag_EP;
}
// Drag of the interfaces of the VNF are complex
function dragINTERFACE(){
    var drag_inteface = d3.behavior.drag()
        .on("drag",function(d){
            var x=parseInt(d3.event.x),y=d3.event.y;
            var interface = d3.select(this);
            var pos=interface.attr("id").replace(/:/g,"\\:");
            var link1=svg.selectAll("[start="+pos+"]");
            var link2=svg.selectAll("[end="+pos+"]");
            var interface_position_x,interface_position_y;
            var interface_js=getInterfaceById(interface.attr("id"));
            if(interface_js.x==0 || interface_js.x==NF_width){
                if(y<interface_js.parent_NF_y){
                    interface_position_y=interface_js.parent_NF_y;
                }else if(y>interface_js.parent_NF_y+NF_height){
                    interface_position_y=interface_js.parent_NF_y+NF_height;
                }else {
                    interface_position_y=y;
                }
                interface.attr("cy", interface_position_y);
                interface_js.y=interface_position_y-interface_js.parent_NF_y;
                if(link1[0].length!==0){
                    link1.attr("y1",interface_position_y);
                }
                if(link2[0].length!==0){
                    link2.attr("y2",interface_position_y);
                }
            }
            if(interface_js.y==0 || interface_js.y==NF_height){
                //console.log(x)
                if(x<interface_js.parent_NF_x){
                    interface_position_x=interface_js.parent_NF_x;
                }else if(x>interface_js.parent_NF_x+NF_width){
                    interface_position_x=interface_js.parent_NF_x+NF_width;
                }else{
                    interface_position_x=x;
                }
                interface.attr("cx",interface_position_x);
                interface_js.x=interface_position_x-interface_js.parent_NF_x;
                if(link1[0].length!==0){
                    link1.attr("x1",interface_position_x);
                }
                if(link2[0].length!==0){
                    link2.attr("x2",interface_position_x);
                }
            }

        })
        .on("dragstart",function(d){
            d3.event.sourceEvent.stopPropagation();
        });
    return drag_inteface;
}
//drag of BS interfaces similar to the VNF interfaces
function dragINTERFACEBIGSWITCH(){
    var drag_inteface_big = d3.behavior.drag()
        .on("drag",function(d){
            var x=d3.event.x,y=d3.event.y;
            var interface = d3.select(this);
            var pos=interface.attr("id").replace(/:/g,"\\:");
            var link1=svg.selectAll("[start=bs-"+pos+"]");
            var link2=svg.selectAll("[end=bs-"+pos+"]");
            var interface_position_x,interface_position_y;
            var interface_js=getBSInterfaceById(interface.attr("id"));
            if(interface_js.x==0 || interface_js.x==BIG_SWITCH_width){
                if(y<big_switch.y){
                    interface_position_y=big_switch.y;
                }else if(y>big_switch.y+BIG_SWITCH_height){
                    interface_position_y=big_switch.y+BIG_SWITCH_height;
                }else {
                    interface_position_y=y;
                }
                interface.attr("cy", interface_position_y);
                interface_js.y=interface_position_y-big_switch.y;
                if(link1[0].length!==0){
                    link1.attr("y1",interface_position_y);
                }
                if(link2[0].length!==0){
                    link2.attr("y2",interface_position_y);
                }
            }
            if(interface_js.y===0 || interface_js.y===BIG_SWITCH_height) {
                if (x < big_switch.x) {
                    interface_position_x = big_switch.x;
                } else if (x > big_switch.x + BIG_SWITCH_width) {
                    interface_position_x = big_switch.x + BIG_SWITCH_width;
                } else {
                    interface_position_x = x;
                }
                interface.attr("cx", interface_position_x);
                interface_js.x = interface_position_x - big_switch.x;
                if(link1[0].length!==0){
                    link1.attr("x1",interface_position_x);
                }
                if(link2[0].length!==0){
                    link2.attr("x2",interface_position_x);
                }
            }

        })
        .on("dragend",function(d){
           // console.log("lalalal");console.log(this);
            if(this.getAttribute("cx")==NF_offset_x  || this.getAttribute("cx")==NF_offset_x+BIG_SWITCH_width){
                if(this.getAttribute("cy")<NF_offset_y) d3.select(this).attr("cy",NF_offset_y);
                if(this.getAttribute("cy")>BIG_SWITCH_height+NF_offset_y) d3.select(this).attr("cy",BIG_SWITCH_height+NF_offset_y);
            }
            if(this.getAttribute("cy")==NF_offset_y || this.getAttribute("cy")==NF_offset_y+BIG_SWITCH_height){
                if(this.getAttribute("cx")<NF_offset_x) d3.select(this).attr("cx",NF_offset_x);
                if(this.getAttribute("cx")>BIG_SWITCH_width+NF_offset_x) d3.select(this).attr("cx",BIG_SWITCH_width+NF_offset_x);
            }
        })
        .on("dragstart",function(d){
            d3.event.sourceEvent.stopPropagation();
        });
    return drag_inteface_big;
}


