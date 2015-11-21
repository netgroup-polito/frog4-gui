/**
 * This file contains the drag functions: NetworkFunctions, EndPoint, Network Function's Interfaces and Big Switch's Interfaces
 *
 **/
/*
 --->>>DA FARE<<<--- OGNI VOLTA CHE SPOSTO OLTRE A DISEGNARLO NELL'HTML ANCHE NEI CORRISPETTIVI CAMPI DEGLI OGGETTI HTML
 */
function dragNF(){
    var drag_NF = d3.behavior.drag()
        .on("drag",function(d) {
            //al drag riporto il centro dell'oggetto NF alle coordinate del mouse (trovate con d3.event.x/.y)
            var x=parseInt(d3.event.x)-NF_width/2-NF_offset_x,
                y=parseInt(d3.event.y)-NF_height/2-NF_offset_y;
            var VNF= d3.select(this);
            //modifica elementi dell'html (grafici)
            VNF.attr("x",x).attr("y",y);
            //modifica elementi javascript
            var VNF_js=getVNFById(VNF.attr("id")); VNF_js.x=x;VNF_js.y=y;
            //per ogni interfaccia dell'NF spostato setto la posizione assoluta dell'NF di cui fa parte rispetto al canvas la posizione
            //assoluta dell'interfaccia all'interno del canvas si trova facendo  parent_NF_position_x+cx e parent_NF_position_y+cy
            //console.log(svg.selectAll(".interface[parent=vnf"+VNF.attr("id")+"]"));
            svg.selectAll(".interface[parent=vnf"+VNF.attr("id")+"]")[0].forEach(function(e){
                var interface=d3.select(e);
                var interface_js=getInterfaceById(interface.attr("id"));
                interface_js.parent_NF_x=x;interface_js.parent_NF_y=y;
                interface.attr("cx",parseInt(interface_js.x)+x);
                interface.attr("cy",parseInt(interface_js.y)+y);
                //console.log(interface);
                //console.log(interface_js);
                interface.attr("parent_NF_position_x",x);
                interface.attr("parent_NF_position_y",y);
                //se sposto l'NF cambia anche il posizionamento dell'oggetto grafico (dovrei cambiare anche l'oggetto js)
                var pos=interface.attr("id").replace(/:/g,"\\:");
                console.log(pos);
                var link1=svg.selectAll("[start="+pos+"]");
                //console.log(interface.attr("cx"));
                if(link1[0].length!==0){
                    link1.attr("x1",interface_js.x+x)
                        .attr("y1",interface_js.y+y)
                }
                var link2=svg.selectAll("[end="+pos+"]");
                if(link2[0].length!==0){
                    link2.attr("x2",interface_js.x+x)
                        .attr("y2",interface_js.y+y)
                }
                //console.log(d3.selectAll("[end="+pos+"]").attr("x1"));
                //var line
            });

        })
        .on("dragstart",function(d){
            //console.log(this);
        });

    return drag_NF;
}
function dragBIGSWITCH(){
    var drag_BIGSWITCH = d3.behavior.drag()
        .on("drag",function(d) {
            //al drag riporto il centro dell'oggetto NF alle coordinate del mouse (trovate con d3.event.x/.y)
            var x=parseInt(d3.event.x)-BIG_SWITCH_width/2-NF_offset_x,
                y=parseInt(d3.event.y)-BIG_SWITCH_height/2-NF_offset_y;
            var BIG= d3.select(this);
            //modifica elementi dell'html (grafici)
            BIG.attr("x",x+NF_offset_x).attr("y",y+NF_offset_y);
            //modifica elementi javascript
            big_switch.x=x;big_switch.y=y;
            //per ogni interfaccia dell'NF spostato setto la posizione assoluta dell'NF di cui fa parte rispetto al canvas la posizione
            //assoluta dell'interfaccia all'interno del canvas si trova facendo  parent_NF_position_x+cx e parent_NF_position_y+cy
            svg.selectAll(".BS_interface")[0].forEach(function(e){
                var interface=d3.select(e);
                //console.log(interface);
                var interface_js = getBSInterfaceById(interface.attr("id"));
                interface.attr("cx",interface_js.x+x);
                interface.attr("cy",interface_js.y+y);
                
            });
        })
        
        var drag_inteface_big = d3.behavior.drag()
            .on("drag",function(d){
                var x=d3.event.x,y=d3.event.y;
                var interface = d3.select(this);
                var interface_position_x,interface_position_y;
                var interface_js=getBSInterfaceById(interface.attr("id"));
                if(interface_js.x==0 || interface_js.x==BIG_SWITCH_width){
                    if(y<big_switch.y){
                        interface_position_y = big_switch.y;
                    }else if(y>big_switch.y+BIG_SWITCH_height){
                        interface_position_y = big_switch.y+BIG_SWITCH_height;
                    }else{
                        interface_position_y = y;
                    }
                    interface.attr("cy",interface_position_y);
                    interface_js.y = interface_position_y-big_switch.y;
                }
                if(interface_js.y===0 || interface_js.y===BIG_SWITCH_height){
                    if(x<big_switch.x){
                        interface_position_x = big_switch.x;
                    }else if(x>big_switch.x + BIG_SWITCH_width){
                        interface_position_x = big_switch.x +BIG_SWITCH_width;
                    }else{
                        interface_position_x = x;
                    }
                    interface.attr("cx",interface_position_x);
                    interface_js.x = interface_position_x - big_switch.x;
                }

            })

    return drag_BIGSWITCH;
}
function dragEP(){
    var drag_EP = d3.behavior.drag()
        .on("drag",function(d){
            var cx=parseInt(d3.event.x),cy=parseInt(d3.event.y);
            var interface = d3.select(this);
            interface.attr("cx",cx).attr("cy",cy);
            var EP_js=getEndPointById(interface.attr("id"));
            EP_js.x=cx;EP_js.y=cy;
            //console.log(EP_js);
            //var pos=interface.attr("id").replace(/:/g,"\\:");
            //console.log(pos);
            var link1=svg.selectAll("[start=endpoint\\:"+interface.attr("id")+"]");
            //console.log(interface.attr("cx"));
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
            //console.log(this);
            d3.event.sourceEvent.stopPropagation();
        });
    return drag_EP;
}

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
            //console.log("->>>>");
            //console.log(this);
            d3.event.sourceEvent.stopPropagation();
        });
    return drag_inteface;
}

function dragINTERFACEBIGSWITCH(){
    var drag_inteface_big = d3.behavior.drag()
        .on("drag",function(d){
            var x=d3.event.x,y=d3.event.y;
            var interface = d3.select(this);
            //var pos=interface.attr("id").replace(/:/g,"\\:");
            //var link1=svg.selectAll("[start="+pos+"]");
            //var link2=svg.selectAll("[end="+pos+"]");
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
                //if(link1[0].length!==0){
                //    link1.attr("y1",interface_position_y);
                //}
                //if(link2[0].length!==0){
                //    link2.attr("y2",interface_position_y);
                //}
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
                //if(link1[0].length!==0){
                //    link1.attr("x1",interface_position_x);
                //}
                //if(link2[0].length!==0){
                //    link2.attr("x2",interface_position_x);
                //}
                //if(interface_js.x===0 || interface_js.x===BIG_SWITCH_width){
                //    if(y<0){ d3.select(this).attr("cy",0);}
                //    else if(y>BIG_SWITCH_height){ d3.select(this).attr("cy",BIG_SWITCH_height);}
                //    else d3.select(this).attr("cy",d3.event.y);
                //}
                //if(this.getAttribute("cy")===0 || this.getAttribute("cy")===BIG_SWITCH_height){
                //
                //    if(x<NF_offset_x){ d3.select(this).attr("cx",NF_offset_x);}
                //    else if(x>BIG_SWITCH_width+NF_offset_x){ d3.select(this).attr("cx",BIG_SWITCH_width+NF_offset_x);}
                //    else d3.select(this).attr("cx",d3.event.x);
                //}
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
            //console.log("->>>>");
            //console.log(this);
            d3.event.sourceEvent.stopPropagation();
        });
    return drag_inteface_big;
}


