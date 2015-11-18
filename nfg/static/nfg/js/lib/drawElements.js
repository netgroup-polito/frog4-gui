/**
 * This file contains the drawing functions, they get the graphical information from the java objectives and put them on the canvas.
 *
 **/

function drawNF() {
    NF_list.forEach(function (ele, index) {

        group[index] = svg.append("g")
            .attr("id", ele.id)
            .attr("class", "VNF");

        group[index].append("use").attr("xlink:href", "#NF_node")
            .attr("id", "nfv" + ele.id).attr("class", "use_NF"); //ogni NF ha un NF_node centrale e attorno tutte le interfacce
        group[index].attr("x",NF_list[index].x);
        group[index].attr("y",NF_list[index].y);
        group[index].attr("transform","translate("+NF_list[index].x+","+NF_list[index].y+")");
        group[index].on("click",function(){
            /* funzioni per selezionare questo oggetto e deselezionare gli altri */
            d3.selectAll(".end-points-select").attr("class","end-points");
            d3.selectAll(".use_BIG").attr("xlink:href","#BIG_SWITCH_node");
            d3.selectAll(".use_NF").attr("xlink:href","#NF_node");
            d3.select("#nfv"+ele.id).attr("xlink:href","#NF_select");
            /* funzioni per visualizzare le informazioni sulla sinistra */
            var vnf = getVNFById(ele.id);
            drawVNFInfo(vnf,ele.id);
        });

        group[index].call(drag_NF);
    });
}
function drawVNF_interfaces(){
        //disegnamo le interfacce
    NF_list.forEach(function(ele,index){
        group[index].selectAll(".interface")
            .data(ele.ports)
            .enter()
            .append("circle")
            .attr("class","interface")
            .attr("cx",function(d){return d.x;})
            .attr("cy",function(d){return d.y;})
            .attr("r",r_interface)
            .attr("parent_NF_position_x",NF_list[index].x)
            .attr("parent_NF_position_y",NF_list[index].y)
            .attr("id",function(e){return "vnf:"+NF_list[index].id+":"+e.id;})
            .call(drag_INTERFACE);
    });
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

function drawBIGSWITCH(){
    var interfaces = [];

    EP_list.forEach(function(ele,index){
        ele["type"] = "endpoint";
        interfaces.push(ele);
    });
    NF_list.forEach(function(ele1,index){
        ele1.ports.forEach(function(ele2,index){
                ele2["type"] = "vnf";
            ele2["id_vnf"] = ele1.id;
            interfaces.push(ele2);
        })
    });

    var big_s = svg.append("g");
    big_s.append("use").attr("xlink:href","#BIG_SWITCH_node")
        .attr("class","use_BIG")
        .style("stroke-dasharray", ("8, 4"));

    big_s.selectAll(".interface").data(interfaces)
        .enter()
        .append("circle")
        .attr("class","interface")
        .attr("cx",function(){return Math.random()*NF_width+10;})
        .attr("cy",0)
        .attr("r",r_interface)
        .attr("ref",function(d){
            if(d.type=="endpoint")
                return "bs:"+d.type+":"+d.id;
            else if(d.type=="vnf")
            return "bs:"+d.type+":"+d.id_vnf+":"+d.id;
        })

        .call(drag_INTERFACEBIGSWITCH);

    big_s.attr("transform","translate(300,200)");
    big_s.on("click",function(){
        d3.selectAll(".end-points-select").attr("class","end-points");
        d3.selectAll(".use_NF").attr("xlink:href","#NF_node");
        d3.select(".use_BIG").attr("xlink:href","#BIG_SWITCH_select");
        drawBigSwitchInfo(fg);

    });
    big_s.call(drag_BIGSWITCH);
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
