/**
 * This file contains the drawing functions, they get the graphical information from the java objectives and put them on the canvas.
 *
 **/

function drawNF() {
    //NF_list.forEach(function (ele, index) {

        //group[index] = svg.append("g")
        //    .attr("id", ele.id)
        //    .attr("class", "VNF");

        svg.selectAll(".NetworkFunction")
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
                console.log(this);
            /* funzioni per selezionare questo oggetto e deselezionare gli altri */
                d3.selectAll(".end-points-select").attr("class","end-points");
                //d3.selectAll(".BigSwitch").attr("xlink:href","#BIG_SWITCH_node");
                d3.selectAll(".NetworkFunction").attr("xlink:href","#NF_node");
                $(this).attr("href","#NF_select");
               // d3.select(d).attr("xlink:href","#NF_select");
                /* funzioni per visualizzare le informazioni sulla sinistra */
                var vnf = getVNFById(d.id);
                drawVNFInfo(vnf,d.id);
             });

        //group[index].call(drag_NF);
    //});
}

function drawBIGSWITCH(){

    var data=[big_switch];
    var big_s=svg.selectAll(".big").data(data).enter()
        .append("use").attr("xlink:href","#BIG_SWITCH_node")
        .attr("class","use_BIG")
        .style("stroke-dasharray", ("8, 4"))
        .attr("x",big_switch.x)
        .attr("y",big_switch.y);

    svg.selectAll(".BS_interface").data(big_switch.interfaces)
        .enter()
        .append("circle")
        .attr("class","BS_interface interface")
        .attr("cx",function(d){return big_switch.x+d.x;})
        .attr("cy",function(d){return big_switch.y+d.y;})
        .attr("id",function(d){return d.id;})
        .attr("r",r_interface)
        .attr("title",function(d){
            if(d.type=="endpoint")
                return "bs:"+d.type+":"+d.id;
            else if(d.type=="vnf")
                return "bs:"+d.type+":"+d.id_vnf+":"+d.id;
        })
        .call(drag_INTERFACEBIGSWITCH);


    big_s.on("click",function(){
        d3.selectAll(".end-points-select").attr("class","end-points");
        d3.selectAll(".use_NF").attr("xlink:href","#NF_node");
        d3.select(".use_BIG").attr("xlink:href","#BIG_SWITCH_select");
        drawBigSwitchInfo(fg);

    });
    big_s.call(drag_BIGSWITCH);
}

function drawVNF_interfaces(){
        //disegnamo le interfacce
    //NF_list.forEach(function(ele,index){
        var interfaces=[];
        NF_list.forEach(function(d){d.ports.forEach(function(e){interfaces.push(e)});});
        svg.selectAll(".interface")
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
            .call(drag_INTERFACE);
    //});
}

function drawEP(){
    svg.selectAll(".end-points")
        .data(EP_list)
        .enter()
        .append("circle")
        .attr("class","end-points")
        .attr("id",function(d){return d.id;})
        .attr("r",r_endpoint)
        /*.attr("transform",function(d){
         return "translate("+d.x+","+d.y+")";
         })*/
        .attr("cx",function(d){return d.x;})
        .attr("cy",function(d){return d.y;})
        .on("click",function(d){
            /* funzioni per selezionare questo oggetto e deselezionare gli altri */
            d3.selectAll(".end-points-select").attr("class","end-points");
            d3.selectAll(".use_NF").attr("xlink:href","#NF_node");
            d3.selectAll(".use_BIG").attr("xlink:href","#BIG_SWITCH_node");
            d3.select(this).attr("class","end-points-select")

            /* funzioni per visualizzare le informazioni sulla sinistra */
            var ep = getEndPointById(d.id);
            drawEndPointInfo(ep,d.id);
        })
        .call(drag_EP);
}



function drawLINE(){

    var lines = svg.selectAll(".line")
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
        .attr("fullduplex",function(d){return d.full_duplex;});
}

/* DrawInfo */
function drawEndPointInfo(endpoint,id){
    $('.info').empty();
    $('.info').append('<a href="#"><i class="glyphicon glyphicon-exclamation-sign"></i><strong> Node Info</strong></a><div class="panel panel-default"><div class="panel-heading">Node Id: '+endpoint.id+' </div><div id="end'+endpoint.id+'"class="panel-body"><p><b>Name:</b> '+endpoint.name+'</p><p><b>Type:</b> '+endpoint.type+'</p></div></div>');
    $('#end'+endpoint.id).append('<div class="panel panel-default"><div class="panel-body"><p><b>Inteface: </b>'+endpoint.interface.interface+'</p><p><b>Node: </b>'+endpoint.interface.node+'</p></div></div>');}
function drawVNFInfo(vnf,id){
    $('.info').empty();
    $('.info').append('<a href="#"><i class="glyphicon glyphicon-exclamation-sign"></i><strong> VNF Info</strong></a><div class="panel panel-default"><div class="panel-heading">VNF Id: '+vnf.id+' </div><div id="vnf'+vnf.id+'"class="panel-body"><p><b>Name:</b> '+vnf.name+'</p></div><div>');

    $('#vnf'+vnf.id).append('<div class="panel panel-default"><div class="panel-body"><p><b>Port: </b>'+vnf.ports[0].id+'</p><p><b>Node: </b>'+vnf.ports[0].name+'</p></div></div>');
    $('#vnf'+vnf.id).append('<div class="panel panel-default"><div class="panel-body"><p><b>Port: </b>'+vnf.ports[1].id+'</p><p><b>Node: </b>'+vnf.ports[1].name+'</p></div></div>')}
function drawBigSwitchInfo(fg){
    $('.info').empty();
    $('.info').append('<a href="#"><i class="glyphicon glyphicon-exclamation-sign"></i><strong> BigSwitch Info</strong></a>');
    fg["forwarding-graph"]["big-switch"]["flow-rules"].forEach(function(e){
        $('.info').append('<div class="panel panel-default"><div class="panel-heading">FlowRule Id: '+e.id+'</div><div id="flowrule'+e.id+'" class="panel-body"><p><b>Priority: '+e.priority+'</b> </p></div></div>');
        $('#flowrule'+e.id).append('<p><b>Action:</b></p>');

        $('#flowrule'+e.id).append('<div class="panel panel-default"><div id="a_'+e.id +'"class="panel-body"></div></div>');
        e.action.forEach(function(a){
            if(a.output!=null)
                $('#a_'+e.id).append('<p><b>Output: </b>'+a.output+'</p>');
            if(a.set_vlan_id!=null)
                $('#a_'+e.id).append('<p><b>Vlan: </b>'+a.set_vlan_id+'</p>');
            if(a.controller!=null)
                $('#a_'+e.id).append('<p><b>Controller: </b>'+a.controller+'</p>');
        });

        if(e.match.ether_type!=null)
            $('#flowrule'+e.id).append('<p><b>EtherType: </b>'+e.match.ether_type+'</p>');
        if(e.match.protocol!=null)
            $('#flowrule'+e.id).append('<p><b>Protocol: </b>'+e.match.protocol+'</p>');
        if(e.match.dest_port!=null)
            $('#flowrule'+e.id).append('<p><b>Destination Port: </b>'+e.match.dest_port+'</p>');
        if(e.match.port_in!=null)
            $('#flowrule'+e.id).append('<p><b>Source Port: </b>'+e.match.port_in+'</p>');
    });}
