/**
 * This file contains the drawing functions, they get the graphical information from the java objectives and put them on the canvas.
 *
 **/


function drawNF_text(elements){

        VNF_text_section.selectAll(".NewNetworkFunction_text")
        .data(elements)
        .enter()
        .append("text")
        .attr("fill","white")
        .text(function(d){
            var text;
            if(d.name==null || d.name == undefined || d.name == ""){
                text = "Unnamed VNF";
            }else if(d.name.length>=18){
                text = d.name.slice(0,18);
            }else{
                text = d.name; 
            }
            return text;
        })
        .attr("id",function(d){return "text_"+d.id;})
        .attr("class","NetworkFunction_text")
        .attr("x",function(d){return d.x+20;})
        .attr("y",function(d){return d.y+NF_height/2+5;});

} 

function drawNF(elements) {

        VNF_section.selectAll(".NewNetworkFunction")
            .data(elements)
            .enter()
            .append("use").attr("xlink:href", "#NF_node")       
            .attr("id", function(d){return d.id;})
            .attr("class", "NetworkFunction")
            .attr("x",function(d){return d.x;})
            .attr("y",function(d){return d.y;})
            .call(drag_NF)
            .on("mousedown",selectVNFs)
            .on("contextmenu",function(d){
                d3.event.preventDefault();
                showEditInfoVNF(d.id);}
            );

}

function drawVNF_interfaces(interfaces){

        interfaces_section.selectAll(".NewInterface")
            .data(interfaces)
            .enter()
            .append("circle")
            .attr("class","interface")
            .attr("cx",function(d){return parseInt(d.x)+parseInt(d.parent_NF_x);})
            .attr("cy",function(d){return parseInt(d.y)+parseInt(d.parent_NF_y);})
            .attr("r",r_interface)
            .attr("parent_NF_position_x",function(d){return d.parent_NF_x;})
            .attr("parent_NF_position_y",function(d){return d.parent_NF_y;})
            .attr("parent",function(d){return "vnf"+d.parent_NF_id;})
            .attr("id",function(d){return "vnf:"+ d.parent_NF_id+":"+d.id;})
            .call(drag_INTERFACE)
			.on("click",select_node);

            

}

function drawEP(elements){

    interfaces_section.selectAll(".NewEndpoint")
        .data(elements)
        .enter()
        .append("circle")
        .attr("class",function(d){ return "end-points "+d.name;})
        .attr("id",function(d){return d.id;})
        .attr("r",r_endpoint)
        .attr("cx",function(d){return d.x;})
        .attr("cy",function(d){return d.y;})
        .attr("title",function(d){return d.name;})
        .style("fill",function(d){switch(d.icon){
                                    case "host":
                                        return "url(#host-icon)";
                                    case "internet":
                                        return "url(#internet-icon)"
                                    }})
        .on("click",selectEndPoints)
        .on("contextmenu",function(d){
            d3.event.preventDefault();
            showEditInfoEP(d.id);})
        .call(drag_EP);
}

function drawBIGSWITCH(){

    var data=[big_switch];
    bs_section.selectAll(".big").data(data).enter()
        .append("use").attr("xlink:href","#BIG_SWITCH_node")
        .attr("class","use_BIG")
        .style("stroke-dasharray", ("8, 4"))
        .attr("x",big_switch.x)
        .attr("y",big_switch.y)
        .on("click",selectBS)
        .call(drag_BIGSWITCH);

}
function drawBSInterfaces(elements){
    interfaces_section.selectAll(".NewBSint")
        .data(elements)
        .enter()
        .append("circle")
        .attr("class","BS_interface interface")
        .attr("cx",function(d){return big_switch.x+d.x;})
        .attr("cy",function(d){return big_switch.y+d.y;})
        .attr("id",function(d){return d.id;})
        .attr("fullId",function(d){return d.fullId;})
        .attr("r",r_interface)
        .attr("title",function(d){
            return d.id;
        })
        .on("click",select_node)
        .call(drag_INTERFACEBIGSWITCH);
}
function drawLINE(elements){
    var lines = lines_section.selectAll(".NewLine")
        .data(elements)
        .enter()
        .append("line")
        .attr("class","line")
        .attr("stroke","black")
        .attr("x1",function(d){return d.match.interface_position_x;})
        .attr("y1",function(d){return d.match.interface_position_y;})
        .attr("x2",function(d){return d.actions[0].interface_position_x;})
        .attr("y2",function(d){return d.actions[0].interface_position_y;})
        .attr("idfr",function(d){return "fr-"+d.id;})
        .attr("title",function(d){return "Source: "+d.match.port_in+" Action: "+d.actions[0].output;})
        //aggiungo l'info da chi parte a chi arriva
        .attr("start",function(d){return d.match.port_in;})
        .attr("end",function(d){return d.actions[0].output;})
        .attr("fullduplex",function(d){return d.full_duplex;})
        .attr("marker-end",function(d) {
            //return d.full_duplex == false ? "url(#EPArrow)" : "default";
            if(d.full_duplex===true) return "default";
            var type=d.actions[0].output.split(":");
            if(type[0]==="vnf") return "url(#IntArrow)";
            else return "url(#EPArrow)";
        })
        .on("click",selectSimpleLines);

}

function drawBSLinks(elements){
    var lines = lines_section.selectAll(".NewBSLine")
        .data(elements)
        .enter()
        .append("line")
        .attr("class","BS-line")
        .attr("stroke","black")
        .attr("x1",function(d){return d.x1;})
        .attr("y1",function(d){return d.y1;})
        .attr("x2",function(d){return d.x2;})
        .attr("y2",function(d){return d.y2;})
        .attr("idfr",function(d){if(d.id!==undefined)return "fr-"+d.id;})
        .attr("title",function(d){return "Source: "+d.start+" Action: "+d.end;})
        //aggiungo l'info da chi parte a chi arriva
        .attr("start",function(d){return d.start;})
        .attr("end",function(d){return d.end;})
        .attr("fullduplex",function(d){return d.full_duplex;})
        .attr("marker-end",function(d) {
            return d.full_duplex == false ? "url(#IntArrow)" : "default";
        })
        .on("click",selectInternalBSLinks);

}

function drawSingleBSInterfaceAndExternalLink(new_bs_int,ele){
    /*disegno l'oggetto bs_int*/
    var newBSIntVet=[];newBSIntVet.push(new_bs_int);
    interfaces_section
        .selectAll(".newBSint")
        .data(newBSIntVet)
        .enter()
        .append("circle")
        .attr("class","BS_interface interface")
        .attr("cx",big_switch.x+new_bs_int.x)
        .attr("cy",big_switch.y+new_bs_int.y)
        .attr("id",new_bs_int.id)
        .attr("r",r_interface)
        .attr("title",new_bs_int.id)
        .on("click",select_node)
        .call(drag_INTERFACEBIGSWITCH);

    /*disegno il link che collega il bs_int al'ele*/
    lines_section
        .append("line")
        .attr("class","BS-line")
        .attr("stroke","black")
        //.attr("opacity",0.6)
        .attr("x1", ele.x)
        .attr("y1",ele.y)
        .attr("x2",big_switch.x+new_bs_int.x)
        .attr("y2",big_switch.y+new_bs_int.y)
        .attr("title","Source: endpoint:"+ele.id+" Action: bs-endpoint:"+ele.id)
        //aggiungo l'info da chi parte a chi arriva
        .attr("start","endpoint:"+ele.id)
        .attr("end","bs-endpoint:"+ele.id);
}

function drawLabelIdFG(){
     $("#fg_id").empty();
     $("#fg_id").append("<b>ID: "+fg["forwarding-graph"]["id"]+"</b>");
     $("#newIDFG").val(fg["forwarding-graph"]["id"]);
}
