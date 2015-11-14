/* Variabili globali */
var svg_width = 960,
    svg_height = 500, 
    NF_width=120,
    NF_height=50,
    NF_offset_x=10,
    NF_offset_y=10,
    r_interface=8,
    r_endpoint=15,
    BIG_SWITCH_width=200,
    BIG_SWITCH_height=130;

    var svg;

/* vettore NF */
    var NF_list=[];

    var EP_list=[];

    var big_switch;
    var flow_rules;


    var drag_NF;
    var drag_EP;
    var drag_INTERFACE;
    var drag_INTERFACEBIGSWITCH;

    var fg;

/* main */

$(document).ready(function(){
                
    $(".external_box").hide();
    /* Richiesta Json */
    $.ajax({ type: "GET",url: "/nfg/ajax_data_request",         
        success: function(data) {
            //console.log(data);
            data = data.replace(/'/g,'"');
            /* definisco oggetto fg */
            fg=JSON.parse(data); 
            DrawForwardingGraph(fg);
        }
    });

});


function DrawForwardingGraph(fg){
    svg = d3.select(".my_canvas").append("svg").attr("width", svg_width).attr("height", svg_height);
    NF_list = fg["forwarding-graph"]["VNFs"];
    EP_list = fg["forwarding-graph"]["end-points"];
    big_switch = fg["forwarding-graph"]["big-switch"];
    flow_rules = fg["forwarding-graph"]["big-switch"]["flow-rules"];

    /* contro degli oggetti se sono null */

    drag_NF = dragNF();
    drag_EP = dragEP();
    drag_INTERFACE = dragINTERFACE();
    drag_INTERFACEBIGSWITCH = dragINTERFACEBIGSWITCH(); 

    var NF = defNF();
    var NF_select = defNF_select();

    var BIG_SWITCH = defBIGSWITCH();
    var BIG_SWITCH_select = defBIGSWITCH_select();

    /* chiamo la funzione per settare il posizionamento iniziale (ancora non prevede end point e big switch) */

    setInitialNFPositions(NF_list);
    setInitialEPPositions(EP_list);

    console.log(EP_list);


    drawNF();
    



        

    drawEP();
    drawBIGSWITCH();

        

        
    
        

       
    drawLINE();

        
        

    console.log(getFlowRulesInfoById(fg,"000000002"));

   // drawBigSwitchInfo(fg);


   $(document).ready(function () {
    
    $(".interface").tooltip({
        'container': 'body',
        'placement': 'top'
        });

    $(".line").tooltip({
        'container': 'body',
        'placement': 'top'
        });

    });



}

/* da mettere nel file drag.js */

function dragNF(){
    var drag_NF = d3.behavior.drag()
            .on("drag",function(d) {
                //al drag riporto il centro dell'oggetto NF alle coordinate del mouse (trovate con d3.event.x/.y)
                var x=parseInt(d3.event.x)-NF_width/2-NF_offset_x,
                    y=parseInt(d3.event.y)-NF_height/2-NF_offset_y;
                console.log(x);

            d3.select(this).attr("transform","translate("+x+","+y+")")
                .attr("x",x+NF_offset_x).attr("y",y+NF_offset_y);
            //per ogni interfaccia dell'NF spostato setto la posizione assoluta dell'NF di cui fa parte rispetto al canvas la posizione
            //assoluta dell'interfaccia all'interno del canvas si trova facendo  parent_NF_position_x+cx e parent_NF_position_y+cy
            d3.select(this).selectAll(".interface")[0].forEach(function(e){
                var interface=d3.select(e);
                interface.attr("parent_NF_position_x",x);
                interface.attr("parent_NF_position_y",y);
                //se sposto l'NF cambia anche il posizionamento dell'oggetto grafico (dovrei cambiare anche l'oggetto js)
                var pos=interface.attr("id").replace(/:/g,"\\:");
                //console.log(pos);
                var link1=svg.selectAll("[start="+pos+"]");
                //console.log(interface.attr("cx"));
                if(link1[0].length!==0){
                    link1.attr("x1",parseInt(interface.attr("cx"))+x)
                        .attr("y1",parseInt(interface.attr("cy"))+y)
                }
                var link2=svg.selectAll("[end="+pos+"]");
                if(link2[0].length!==0){
                    link2.attr("x2",parseInt(interface.attr("cx"))+x)
                        .attr("y2",parseInt(interface.attr("cy"))+y)
                }
                //console.log(d3.selectAll("[end="+pos+"]").attr("x1"));
                //var line
            });

            })
            .on("dragstart",function(d){
                console.log(this);
            });

    return drag_NF;}
function dragEP(){
    var drag_EP = d3.behavior.drag()
            .on("drag",function(d){
                var cx=parseInt(d3.event.x),cy=parseInt(d3.event.y);
                d3.select(this)//.attr("transform","translate("+cx+","+cy+")")
                       .attr("cx",cx).attr("cy",cy);
                var interface = d3.select(this);
                var pos=interface.attr("id").replace(/:/g,"\\:");
                console.log(pos);
                var link1=svg.selectAll("[start="+pos+"]");
                console.log(interface.attr("cx"));
                if(link1[0].length!==0){
                    link1.attr("x1",parseInt(interface.attr("cx")))
                        .attr("y1",parseInt(interface.attr("cy")))
                }
                var link2=svg.selectAll("[end="+pos+"]");
                if(link2[0].length!==0){
                    link2.attr("x2",parseInt(interface.attr("cx")))
                        .attr("y2",parseInt(interface.attr("cy")))
                }
            }).on("dragstart",function(d){
                console.log(this);
                d3.event.sourceEvent.stopPropagation();
            });
    return drag_EP;}
function dragINTERFACE(){
    var drag_inteface = d3.behavior.drag()
            .on("drag",function(d){
                var x=d3.event.x,y=d3.event.y;
                var interface = d3.select(this);
                var pos=interface.attr("id").replace(/:/g,"\\:");
                var link1=svg.selectAll("[start="+pos+"]");
                var link2=svg.selectAll("[end="+pos+"]");
                var interface_position_x,interface_position_y;
                //console.log(x);
                //console.log(y);
                if(interface.attr("cx")==NF_offset_x || interface.attr("cx")==NF_offset_x+NF_width){
                if(d3.event.y<NF_offset_y){
                    interface_position_y=NF_offset_y;
                }else if(d3.event.y>NF_height+NF_offset_y){
                    interface_position_y=NF_height+NF_offset_y;
                }else {
                    interface_position_y=d3.event.y;
                }
                interface.attr("cy", interface_position_y);
                if(link1[0].length!==0){
                    link1.attr("y1",interface_position_y+parseInt(interface.attr("parent_NF_position_y")));
                }
                if(link2[0].length!==0){
                    link2.attr("y2",interface_position_y+parseInt(interface.attr("parent_NF_position_y")));
                }
            }
            if(interface.attr("cy")==NF_offset_y || interface.attr("cy")==NF_offset_y+NF_height){
                if(d3.event.x<NF_offset_x){
                    interface_position_x=NF_offset_x;
                }else if(d3.event.x>NF_width+NF_offset_x){
                    interface_position_x=NF_width+NF_offset_x;
                }else{
                    interface_position_x=d3.event.x;
                }
                interface.attr("cx",interface_position_x);
                if(link1[0].length!==0){
                    link1.attr("x1",interface_position_x+parseInt(interface.attr("parent_NF_position_x")));
                }
                if(link2[0].length!==0){
                    link2.attr("x2",interface_position_x+parseInt(interface.attr("parent_NF_position_x")));
                }
            }

            })
            .on("dragend",function(d){
                console.log("lalalal");console.log(this);
                if(this.getAttribute("cx")==NF_offset_x  || this.getAttribute("cx")==NF_offset_x+NF_width){
                    if(this.getAttribute("cy")<NF_offset_y) d3.select(this).attr("cy",NF_offset_y);
                    if(this.getAttribute("cy")>NF_height+NF_offset_y) d3.select(this).attr("cy",NF_height+NF_offset_y);
                }
                if(this.getAttribute("cy")==NF_offset_y || this.getAttribute("cy")==NF_offset_y+NF_height){
                    if(this.getAttribute("cx")<NF_offset_x) d3.select(this).attr("cx",NF_offset_x);
                    if(this.getAttribute("cx")>NF_width+NF_offset_x) d3.select(this).attr("cx",NF_width+NF_offset_x);
                }
            })
            .on("dragstart",function(d){
                console.log("->>>>");
                console.log(this);
                d3.event.sourceEvent.stopPropagation();
            });
            return drag_inteface;}
function dragINTERFACEBIGSWITCH(){
    var drag_inteface_big = d3.behavior.drag()
            .on("drag",function(d){
                var x=d3.event.x,y=d3.event.y;
                console.log(x);
                console.log(y);
                if(this.getAttribute("cx")==NF_offset_x || this.getAttribute("cx")==NF_offset_x+BIG_SWITCH_width){
                    if(d3.event.y<NF_offset_y){ d3.select(this).attr("cy",NF_offset_y);}
                    else if(d3.event.y>BIG_SWITCH_height+NF_offset_y){ d3.select(this).attr("cy",BIG_SWITCH_height+NF_offset_y);}
                    else d3.select(this).attr("cy",d3.event.y);
                }
                if(this.getAttribute("cy")==NF_offset_y || this.getAttribute("cy")==NF_offset_y+BIG_SWITCH_height){

                    if(d3.event.x<NF_offset_x){ d3.select(this).attr("cx",NF_offset_x);}
                    else if(d3.event.x>BIG_SWITCH_width+NF_offset_x){ d3.select(this).attr("cx",BIG_SWITCH_width+NF_offset_x);}
                    else d3.select(this).attr("cx",d3.event.x);
                }

            })
            .on("dragend",function(d){
                console.log("lalalal");console.log(this);
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
                console.log("->>>>");
                console.log(this);
                d3.event.sourceEvent.stopPropagation();
            });
    return drag_inteface_big;}


function defNF(){
    var NF = svg.append("defs").append("g").attr("id","NF_node");
    NF.append("rect")
            .attr("x",NF_offset_x)
            .attr("y",NF_offset_y)
            .attr("width",NF_width)
            .attr("height",NF_height)
            .attr("class","nf");
    return NF;}
function defNF_select(){
    var NF_select = svg.append("defs").append("g").attr("id","NF_select");
    NF_select.append("rect")
            .attr("x",NF_offset_x)
            .attr("y",NF_offset_y)
            .attr("width",NF_width)
            .attr("height",NF_height)
            .attr("class","nf-select");
    return NF_select;}
function defBIGSWITCH(){
    var BIG_SWITCH = svg.append("defs").append("g").attr("id","BIG_SWITCH_node");
    BIG_SWITCH.append("rect")
            .attr("x",NF_offset_x)
            .attr("y",NF_offset_y)
            .attr("width",BIG_SWITCH_width)
            .attr("height",BIG_SWITCH_height)
            .attr("class","big-switch");
    return BIG_SWITCH;}
function defBIGSWITCH_select(){
    var BIG_SWITCH_select = svg.append("defs").append("g").attr("id","BIG_SWITCH_select");
    BIG_SWITCH_select.append("rect")
            .attr("x",NF_offset_x)
            .attr("y",NF_offset_y)
            .attr("width",BIG_SWITCH_width)
            .attr("height",BIG_SWITCH_height)
            .attr("class","big-switch-select");

    return BIG_SWITCH_select;}

/* Visualizzare Info */      

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

function drawNF(){
    NF_list.forEach(function(ele,index){
        var group = svg.append("g");
        group.append("use").attr("xlink:href","#NF_node") //ogni NF ha un NF_node centrale e attorno tutte le interfacce
                           .attr("id","nfv"+ele.id)
                           .attr("class","use_NF");

        //disegnamo le interfacce
        group.selectAll(".interface")
                .data(ele.ports)
                .enter()
                .append("circle")
                .attr("class","interface")
                .attr("cx",function(){return Math.random()*NF_width+10;})
                .attr("cy","10")
                .attr("r",r_interface)
                .attr("parent_NF_position_x",NF_list[index].x)
                .attr("parent_NF_position_y",NF_list[index].y)
                .attr("id",function(e){return "vnf:"+NF_list[index].id+":"+e.id;})
                .call(drag_INTERFACE);
        
        group.attr("x",NF_list[index].x);
        group.attr("y",NF_list[index].y);
        group.attr("transform","translate("+NF_list[index].x+","+NF_list[index].y+")");
        group.on("click",function(){
            /* funzioni per selezionare questo oggetto e deselezionare gli altri */ 
            d3.selectAll(".end-points-select").attr("class","end-points");
            d3.selectAll(".use_BIG").attr("xlink:href","#BIG_SWITCH_node");
            d3.selectAll(".use_NF").attr("xlink:href","#NF_node");
            d3.select("#nfv"+ele.id).attr("xlink:href","#NF_select");
            /* funzioni per visualizzare le informazioni sulla sinistra */
            var vnf = getVNFInfoById(fg,ele.id);
            drawVNFInfo(vnf,ele.id);
        });

        group.call(drag_NF);});}
function drawEP(){
    svg.selectAll(".end-points")
           .data(EP_list)
           .enter()
           .append("circle")
           .attr("class","end-points")
           .attr("id",function(d){return "endpoint:"+d.id;})
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
                var ep = getEndPointInfoById(fg,d.id);
                drawEndPointInfo(ep,d.id);  
           })
           .call(drag_EP);}
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
                           .attr("class","use_BIG");

        big_s.selectAll(".interface").data(interfaces)
                                     .enter()
                                     .append("circle")
                                     .attr("class","interface")
                                     .attr("cx",function(){return Math.random()*NF_width+10;})
                                     .attr("cy","10")
                                     .attr("r",r_interface)
                                     .attr("title",function(d){
                                        if(d.type=="endpoint")
                                            return d.type+":"+d.id;
                                        else(d.type=="vnf")
                                            return d.type+":"+d.id_vnf+":"+d.id;
                                     })
                                     
                                     .call(drag_INTERFACEBIGSWITCH);

        big_s.attr("transform","translate(300,200)");
        big_s.on("click",function(){
            d3.selectAll(".end-points-select").attr("class","end-points");
            d3.selectAll(".use_NF").attr("xlink:href","#NF_node");
            d3.select(".use_BIG").attr("xlink:href","#BIG_SWITCH_select");
            drawBigSwitchInfo(fg);

        });                           
        big_s.call(drag_NF);}

function drawLINE(){
    elaborateFlowRules(flow_rules,svg);
        //console.log("ciao");
        console.log(flow_rules);

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

/* Oggetti */

function getVNFInfoById(fg,id){
    var vnf;
    fg["forwarding-graph"]["VNFs"].forEach(function(e){
        if(e.id == id){ vnf=e;}
    });

    return vnf;}
function getEndPointInfoById(fg,id){
    var endpoint;
    fg["forwarding-graph"]["end-points"].forEach(function(e){
        if (e.id == id) {/*console.log(e);*/ endpoint=e;}

    });
    return endpoint;}
function getFlowRulesInfoById(fg,id){
  var flowrule;
  fg["forwarding-graph"]["big-switch"]["flow-rules"].forEach(function(e){
    if(e.id == id){ flowrule=e; }
  });  
  return flowrule;}



function elaborateFlowRules(flow_rules,svg){

    //funzione che
    // 1. arricchische il campo match e il campo action con la posizione delle corrispettive interfacce
    // 2. elimina l'info rindondante andata-ritorno, e setta un campo aggiuntivo che dice se è fullduplex o no

    flow_rules.forEach(function(fr,i){
        //1 setto la posizione delle interfacce

        var pos=getLinkEndPositionById(fr["match"]["port_in"],svg);
        fr["match"]["interface_position_x"]=pos.x;
        fr["match"]["interface_position_y"]=pos.y;

        console.log("match");

        pos=getLinkEndPositionById(fr["action"][0]["output"],svg);
        fr["action"][0]["interface_position_x"]=pos.x;
        fr["action"][0]["interface_position_y"]=pos.y;

        console.log(pos.x,pos.y);

        //2. cerco all'interno di flow_rules se c'è il suo duale, se no setto fullduplex a false;
        //DA FARE SE è FULL DUPLEX OCCORRE NON AGGIUNGERE UNA SECONDA VOLTA UNA LINEA!
        fr["full_duplex"] = false;
        for(var j=0;j<flow_rules.length;j++) {
            if (fr["match"]["port_in"] === flow_rules[j]["action"]["output"] && fr["action"]["output"] == flow_rules[j]["match"]["port_in"]) {
                fr["full_duplex"] = true;
                break;
            }
        }
    });
    console.log("dentro elaborateFlowRules");}



function setInitialNFPositions(NFS_nodes){
    var n=NFS_nodes.length;
    var alfa=2*Math.PI/n;
    for(var i=0;i<n;i++){
        NFS_nodes[i].x=parseInt(300*Math.cos(alfa*(i))+svg_width/2-NF_width/2-NF_offset_x/2);
        NFS_nodes[i].y=parseInt(300*Math.sin(alfa*(i))+svg_height/2-NF_height/2-NF_offset_y/2);
        
    }
}
function setInitialEPPositions(EPS_nodes){
    var n=EPS_nodes.length;
    var alfa=2*Math.PI/2;
    for(var i=0;i<n;i++){
        EPS_nodes[i].x=parseInt(200*Math.cos(alfa*(i)+Math.PI/2)+svg_width/2);
        EPS_nodes[i].y=parseInt(200*Math.sin(alfa*(i)+Math.PI/2)+svg_height/2);
        
    }

}    
function getLinkEndPositionById(id,svg){
        //dato un id, devo ricavarmi la posizione di tale interfaccia
        console.log(id);
        var data=id.split(":");
        console.log("data");
        console.log(data);

        if(data[0]==="vnf"){
            var id_mod=id.replace(/:/g,"\\:");
            //console.log("id_mod: "+id_mod);
            var NF_interface=svg.select("#"+id_mod);
            var x=parseInt(NF_interface.attr("cx"))+parseInt(NF_interface.attr("parent_NF_position_x"));
            var y=parseInt(NF_interface.attr("cy"))+parseInt(NF_interface.attr("parent_NF_position_y"));

            return {x:x,y:y};
        }else{
            if(data[0]==="endpoint"){
                
                
                var id_mod=id.replace(/:/g,"\\:");
                var EP_interface=svg.select("#"+id_mod);
                var x=parseInt(EP_interface.attr("cx"));
                var y=parseInt(EP_interface.attr("cy"));
                //console.log(x,y);

                return {x:x,y:y};
            }
        }
}


