/**
 * This file contains the drawing functions, they get the graphical information from the java objectives and put them on the canvas.
 *
 **/

function drawNF() {
    //NF_list.forEach(function (ele, index) {

        //group[index] = svg.append("g")
        //    .attr("id", ele.id)
        //    .attr("class", "VNF");

        VNF_section.selectAll(".NetworkFunction")
            .data(NF_list)
            .enter()
            .append("use").attr("xlink:href", "#NF_node")       
            .attr("id", function(d){return d.id;})
            .attr("class", "NetworkFunction") //ogni NF ha un NF_node centrale e attorno tutte le interfacce
        //group[index]
            .attr("x",function(d){return d.x;})
            .attr("y",function(d){return d.y;})
            //.attr("transform","translate("+NF_list[index].x+","+NF_list[index].y+")")
            .call(drag_NF)
            .on("click",function(d){ //da sistemare!
               // console.log(this);
                selected_node=this;
            /* funzioni per selezionare questo oggetto e deselezionare gli altri */
                d3.selectAll(".host").attr("class","end-points host").style("fill","url(#host-icon)");
                d3.selectAll(".internet").attr("class","end-points internet").style("fill","url(#internet-icon)");
                d3.selectAll(".end-points-select").attr("class","end-points");

                //d3.selectAll(".BigSwitch").attr("xlink:href","#BIG_SWITCH_node");
                d3.selectAll(".NetworkFunction").attr("xlink:href","#NF_node");
                d3.selectAll(".use_BIG").attr("xlink:href","#BIG_SWITCH_node");
                $(this).attr("href","#NF_select");
               // d3.select(d).attr("xlink:href","#NF_select");
                /* funzioni per visualizzare le informazioni sulla sinistra */
                var vnf = getVNFById(d.id);
                drawVNFInfo(vnf,d.id);
             });

        
}
function drawVNF_interfaces(){
        //disegnamo le interfacce
    //NF_list.forEach(function(ele,index){
        var interfaces=[];
        NF_list.forEach(function(d){d.ports.forEach(function(e){interfaces.push(e)});});
        interfaces_section.selectAll(".interface")
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
    //});
}

function drawEP(){

    interfaces_section.selectAll(".end-points")
        .data(EP_list)
        .enter()
        .append("circle")
        .attr("class",function(d){ return "end-points "+d.name;})
        .attr("id",function(d){return d.id;})
        .attr("r",r_endpoint)
        .attr("cx",function(d){return d.x;})
        .attr("cy",function(d){return d.y;})
        .attr("title",function(d){return d.name;})
        .style("fill",function(d){switch(d.name){
                                    case "host":
                                        return "url(#host-icon)";
                                    case "internet":
                                        return "url(#internet-icon)"
                                    }})
        .on("click",function(d){

            select_node(d);
            selected_node=this;
            /* funzioni per selezionare questo oggetto e deselezionare gli altri */
            d3.selectAll(".host").attr("class","end-points host").style("fill","url(#host-icon)");
            d3.selectAll(".internet").attr("class","end-points internet").style("fill","url(#internet-icon)");

            d3.selectAll(".end-points-select").attr("class","end-points");
            d3.selectAll(".NetworkFunction").attr("xlink:href","#NF_node");
            d3.selectAll(".use_BIG").attr("xlink:href","#BIG_SWITCH_node");

            switch(d.name){
                case "host":
                    d3.select(this).attr("class","end-points-select "+d.name).style("fill","url(#host-select-icon)");
                    break;
                case "internet":
                     d3.select(this).attr("class","end-points-select "+d.name).style("fill","url(#internet-select-icon)");
                     break;
                default:
                    d3.select(this).attr("class","end-points-select "+d.name);
                    break;
            }


            /* funzioni per visualizzare le informazioni sulla sinistra */
            var ep = getEndPointById(d.id);
            drawEndPointInfo(ep,d.id);

        })
        .call(drag_EP);
}

function drawBIGSWITCH(){

    var data=[big_switch];
    var big_s=VNF_section.selectAll(".big").data(data).enter()
        .append("use").attr("xlink:href","#BIG_SWITCH_node")
        .attr("class","use_BIG")
        .style("stroke-dasharray", ("8, 4"))
        .attr("x",big_switch.x)
        .attr("y",big_switch.y);

    interfaces_section.selectAll(".BS_interface").data(big_switch.interfaces)
        .enter()
        .append("circle")
        .attr("class","BS_interface interface")
        .attr("cx",function(d){return big_switch.x+d.x;})
        .attr("cy",function(d){return big_switch.y+d.y;})
        .attr("id",function(d){return d.id;})
        .attr("r",r_interface)
        .attr("title",function(d){
            if(d.ref=="endpoint")
                return d.id;
            else if(d.ref=="vnf")
                return d.id;
        })
        .on("click",select_node)
        .call(drag_INTERFACEBIGSWITCH);


    big_s.on("click",function(){
        d3.selectAll(".host").attr("class","end-points host").style("fill","url(#host-icon)");
        d3.selectAll(".internet").attr("class","end-points internet").style("fill","url(#internet-icon)");
        d3.selectAll(".end-points-select").attr("class","end-points");

        d3.selectAll(".NetworkFunction").attr("xlink:href","#NF_node");
        d3.select(".use_BIG").attr("xlink:href","#BIG_SWITCH_select");
        drawBigSwitchInfo(fg);

    });
    big_s.call(drag_BIGSWITCH);
}

function drawLINE(){
    var lines = lines_section.selectAll(".line")
        .data(flow_rules)
        .enter()
        .append("line")
        .attr("class","line")
        .attr("stroke","black")
        .attr("x1",function(d){return d.match.interface_position_x;})
        .attr("y1",function(d){return d.match.interface_position_y;})
        .attr("x2",function(d){return d.action[0].interface_position_x;})
        .attr("y2",function(d){return d.action[0].interface_position_y;})
        .attr("title",function(d){return "Source: "+d.match.port_in+" Action: "+d.action[0].output;})
        //aggiungo l'info da chi parte a chi arriva
        .attr("start",function(d){return d.match.port_in;})
        .attr("end",function(d){return d.action[0].output;})
        .attr("fullduplex",function(d){return d.full_duplex;})
        .style("marker-end",function(d) {
            return d.full_duplex == false ? "url(#end-arrow)" : "default";
        })
        .on("click",function(){
            selected_link=this;
            $(this).css("stroke","red");
        });

}

function drawBSLinks(){
    var lines = lines_section.selectAll(".BS_line")
        .data(bs_links)
        .enter()
        .append("line")
        .attr("class","BS_line")
        .attr("stroke","black")
        .attr("opacity",0.6)
        .attr("x1",function(d){return d.x1;})
        .attr("y1",function(d){return d.y1;})
        .attr("x2",function(d){return d.x2;})
        .attr("y2",function(d){return d.y2;})
        .attr("title",function(d){return "Source: "+d.start+" Action: "+d.end;})
        //aggiungo l'info da chi parte a chi arriva
        .attr("start",function(d){return d.start;})
        .attr("end",function(d){return d.end;})
        .attr("fullduplex",function(d){return d.full_duplex;})
        .on("click",function(){
            selected_link=this;
            d3.select(this).attr("stroke","red");
        });
}

/* DrawInfo */
function drawEndPointInfo(endpoint,id){
    console.log(endpoint);
    $('.info').empty();
    $('.info').append('<a href="#"><i class="glyphicon glyphicon-exclamation-sign"></i><strong> Node Info</strong></a><div class="panel panel-default"><div class="panel-heading">Node Id: '+endpoint.id+' </div><div id="end'+endpoint.id+'"class="panel-body"><p><b>Name:</b> '+endpoint.name+'</p><p><b>Type:</b> '+endpoint.type+'</p></div></div>');
    switch(endpoint.type){
        case "internal":
            break;

        case "interface":
            var inter = endpoint["interface"];
            $('#end'+endpoint.id).append('<div class="panel panel-default"><div class="panel-body" id="inter"></div></div>');
            $("#inter").append('<p><b>Inteface: </b>'+inter["interface"]+'</p>');
            $("#inter").append('<p><b>Node: </b>'+inter["node"]+'</p>');
            $("#inter").append('<p><b>Switch ID: </b>'+inter["switch-id"]+'</p>');
            break;

        case "interface-out":
            var inter = endpoint["interface-out"];
            $('#end'+endpoint.id).append('<div class="panel panel-default"><div class="panel-body" id="inter"></div></div>');
            $("#inter").append('<p><b>Inteface: </b>'+inter["interface"]+'</p>');
            $("#inter").append('<p><b>Node: </b>'+inter["node"]+'</p>');
            $("#inter").append('<p><b>Switch ID: </b>'+inter["switch-id"]+'</p>');
            break;

        case "gre-tunnel":
            var inter = endpoint["gre-tunnel"];
            $('#end'+endpoint.id).append('<div class="panel panel-default"><div class="panel-body" id="inter"></div></div>');
            $("#inter").append('<p><b>Local IP: </b>'+inter["local-ip"]+'</p>');
            $("#inter").append('<p><b>Remote IP: </b>'+inter["remote-ip"]+'</p>');
            $("#inter").append('<p><b>Interface: </b>'+inter["interface"]+'</p>');
            $("#inter").append('<p><b>TTL: </b>'+inter["ttl"]+'</p>');
            break;
            
        case "vlan":
            var inter = endpoint["vlan"];
            $('#end'+endpoint.id).append('<div class="panel panel-default"><div class="panel-body" id="inter"></div></div>');
            $("#inter").append('<p><b>Vlan ID: </b>'+inter["vlan-id"]+'</p>');
            $("#inter").append('<p><b>Interface: </b>'+inter["interface"]+'</p>');
            $("#inter").append('<p><b>Switch ID: </b>'+inter["switch-id"]+'</p>');
            $("#inter").append('<p><b>Node: </b>'+inter["node"]+'</p>');
            break;
    }
    $('#end'+endpoint.id).append('<p class="edit"><a href="#" onclick="showEditInfoEP('+endpoint.id+')"><strong><i class="glyphicon glyphicon-wrench"></i> Edit</strong></a></p>');
}
    
function drawVNFInfo(vnf,id){
    $('.info').empty();
    $('.info').append('<a href="#"><i class="glyphicon glyphicon-exclamation-sign"></i><strong> VNF Info</strong></a><div class="panel panel-default"><div class="panel-heading">VNF Id: '+vnf.id+' </div><div id="vnf'+vnf.id+'"class="panel-body"><p><b>Name:</b> '+vnf.name+'</p><p><b>Ports:</b></p></div><div>');

    vnf.ports.forEach(function(porta){
        $('#vnf'+vnf.id).append('<div class="panel panel-default"><div class="panel-body"><p><b>Port: </b>'+porta.id+'</p><p><b>Name: </b>'+porta.name+'</p></div></div>');
    });
    $('#vnf'+vnf.id).append('<p class="edit"><a href="#" onclick="showEditInfoVNF('+vnf.id+')"><strong><i class="glyphicon glyphicon-wrench"></i> Edit</strong></a></p>');


}
function drawBigSwitchInfo(fg){
    $('.info').empty();
    $('.info').append('<a onclick="ReduceAll()"><i class="glyphicon glyphicon-exclamation-sign"></i><strong> BigSwitch Info</strong></a>');
    flow_rules.forEach(function(e){
        /*$html = '<div class="panel panel-default"><div class="panel-heading"><a onclick="Reduce('+e.id+')">FlowRule Id: '+e.id+' (';*/
        $html = '<div class="panel panel-default"><div class="panel-heading"><a onclick="Reduce('+e.id+')">FlowRule (';           

        $html+=e.action[0].output+" ";
        
        $html += ')</a></div><div id="flowrule'+e.id+'" class="panel-body"><p><b>Priority: '+e.priority+'</b> </p></div></div>';
        $('.info').append($html);
        $('#flowrule'+e.id).append('<p><b>Action:</b></p>');

        $('#flowrule'+e.id).append('<div class="panel panel-default"><div id="a_'+e.id +'"class="panel-body"></div></div>');
        
            if(e.action[0].output!=null)
                $('#a_'+e.id).append('<p><b>Output: </b>'+e.action[0].output+'</p>');
           
            
        
            /* aggiungere gli altri*/

        if(e.match.ether_type!=null)
            $('#flowrule'+e.id).append('<p><b>EtherType: </b>'+e.match.ether_type+'</p>');
        if(e.match.protocol!=null)
            $('#flowrule'+e.id).append('<p><b>Protocol: </b>'+e.match.protocol+'</p>');
        if(e.match.dest_port!=null)
            $('#flowrule'+e.id).append('<p><b>Destination Port: </b>'+e.match.dest_port+'</p>');
        if(e.match.port_in!=null)
            $('#flowrule'+e.id).append('<p><b>Source Port: </b>'+e.match.port_in+'</p>');

        /* aggiungere gli altri*/
    });}

function ReduceAll(){
    fg["forwarding-graph"]["big-switch"]["flow-rules"].forEach(function(e){
        $('#flowrule'+e.id).hide();
    });
}

function Reduce(id){
    if(id<10){
        id="00000000"+id;
    }else{
        id="0000000"+id;
    }

    $('#flowrule'+id).slideToggle("slow");
    
}
