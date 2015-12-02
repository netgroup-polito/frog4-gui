/**
 * This file contains generic utility functions.
 *
 **/

function getVNFById(id){
    var vnf;
    NF_list.forEach(function(e){
        if(e.id == id){ vnf=e;}
    });
    return vnf;
}

function getEndPointById(id){
    var endpoint;
    EP_list.forEach(function(e){
        if (e.id == id) {endpoint=e;}

    });
    return endpoint;
}

function getBSInterfaceById(id){
    var inter;
    big_switch.interfaces.forEach(function(e){
        if(e.id==id){   inter=e;    }
    });
    return inter;
}

function getFlowRulesById(id){
    var flowrule;
    flow_rules.forEach(function(e){
        if(e.id == id){ flowrule=e; }
    });
    return flowrule;
}

function getInterfaceById(id){
    var interface;
    var data=id.split(":");
    NF_list.forEach(function(nf){
        if(nf.id == data[1]){ nf["ports"].forEach(function(i){ if(i.id==data[2]+":"+data[3]) interface=i;}); }
    });
    return interface;
}

function elaborateFlowRules(){
    //funzione che
    // 1. arricchische il campo match e il campo action con la posizione delle corrispettive interfacce
    // 2. elimina l'info rindondante andata-ritorno, e setta un campo aggiuntivo che dice se � fullduplex o no

    flow_rules.forEach(function(fr,i){
        //1 setto la posizione delle interfacce

        var pos=getLinkEndPositionById(fr["match"]["port_in"]);
        fr["match"]["interface_position_x"]=pos.x;
        fr["match"]["interface_position_y"]=pos.y;

        //console.log("match");
        /*
        --->>>DA FARE<<<--- da nodificare con un forEach
         */
        pos=getLinkEndPositionById(fr["action"][0]["output"]);
        fr["action"][0]["interface_position_x"]=pos.x;
        fr["action"][0]["interface_position_y"]=pos.y;

        //console.log(pos.x,pos.y);

        //2. cerco all'interno di flow_rules se c'� il suo duale, se no setto fullduplex a false;
        //--->>>DA FARE<<<--- SE � FULL DUPLEX OCCORRE NON AGGIUNGERE UNA SECONDA VOLTA UNA LINEA!
        fr["full_duplex"] = false;
        for(var j=i;j<flow_rules.length;j++) {
            if (fr["double"]===undefined && fr["match"]["port_in"] === flow_rules[j]["action"][0]["output"] && fr["action"][0]["output"] == flow_rules[j]["match"]["port_in"]) {
                fr["full_duplex"] = true;
                flow_rules[j]["double"]=true;
                break;
            }
        }

        //3 aggiunco alla lista delle interfacce del bs 2 nuovi elementi:
        //var bs_x=300,bs_y=200;
        //var int1={id:"bs-"+fr["match"]["port_in"],x:parseInt(Math.random()*BIG_SWITCH_width),y:0};
        //var int2={id:"bs-"+fr["action"]["output"],x:parseInt(Math.random()*BIG_SWITCH_width),y:0};
        //big_switch.interfaces.push(int1);
        //big_switch.interfaces.push(int2);

    });
    flow_rules= _.filter(flow_rules,function(e){return e["double"]!==undefined || e["full_duplex"]===false;});
    flow_rules.forEach(function(fr){
        var int1=getBSInterfaceById(fr["match"]["port_in"]);
        var int2=getBSInterfaceById(fr["action"][0]["output"]);

        var link1={
            x1: fr["match"]["interface_position_x"],
            y1: fr["match"]["interface_position_y"],
            x2: int1.x + big_switch.x,
            y2: int1.y + big_switch.y,
            start: fr["match"]["port_in"],
            end: "bs-"+int1.id,
            full_duplex: fr["full_duplex"]
        };
        var link2={
            x1: int1.x + big_switch.x,
            y1: int1.y + big_switch.y,
            x2: int2.x + big_switch.x,
            y2: int2.y + big_switch.y,
            start: "bs-"+int1.id,
            end: "bs-"+int2.id,
            full_duplex: fr["full_duplex"]
        };
        var link3={
            x1: int2.x + big_switch.x,
            y1: int2.y + big_switch.y,
            x2: fr["action"][0]["interface_position_x"],
            y2: fr["action"][0]["interface_position_y"],
            start: "bs-"+int2.id,
            end:  fr["action"][0]["output"],
            full_duplex: fr["full_duplex"]
        };

        bs_links.push(link1);
        bs_links.push(link2);
        bs_links.push(link3);

    });
}
function getPos(ele,bx,by){
    var pos={};
    var m1={},m2={},m3={},m4={};
    m1.x=bx;
    m1.y=by+BIG_SWITCH_height/2;

    m2.x=bx+BIG_SWITCH_width;
    m2.y=by+BIG_SWITCH_height/2;

    m3.x=bx+BIG_SWITCH_width/2;
    m3.y=by;

    m4.x=bx+BIG_SWITCH_width/2;
    m4.y=by+BIG_SWITCH_height;

    var d1=Math.pow(ele.x-m1.x,2)+Math.pow(ele.y-m1.y,2);
    var d2=Math.pow(ele.x-m2.x,2)+Math.pow(ele.y-m2.y,2);
    var d3=Math.pow(ele.x-m3.x,2)+Math.pow(ele.y-m3.y,2);
    var d4=Math.pow(ele.x-m4.x,2)+Math.pow(ele.y-m4.y,2);
    console.log(d1);
    console.log(d2);
    console.log(d3);
    console.log(d4);
    var min=Math.min(d1,d2,d3,d4);

    switch (min){
        case d1:
            console.log("d1");
            if(ele.y<by){
                pos.y=by;
            }else if(ele.y>by+BIG_SWITCH_height){
                pos.y=by+BIG_SWITCH_height;
            }else{
                pos.y=ele.y;
            }
            pos.x=bx;
            break;
        case d2:
            console.log("d2");
            if(ele.y<by){
                pos.y=by;
            }else if(ele.y>by+BIG_SWITCH_height){
                pos.y=by+BIG_SWITCH_height;
            }else{
                pos.y=ele.y;
            }
            pos.x=bx+BIG_SWITCH_width;
            break;
        case d3:
            console.log("d3");
            if(ele.x<bx){
                pos.x=bx;
            }else if(ele.x>bx+BIG_SWITCH_width){
                pos.x=bx+BIG_SWITCH_width;
            }else{
                pos.x=ele.x;
            }
            pos.y=by;
            break;
        case d4:
            console.log("d4");
            if(ele.x<bx){
                pos.x=bx;
            }else if(ele.x>bx+BIG_SWITCH_width){
                pos.x=bx+BIG_SWITCH_width;
            }else{
                pos.x=ele.x;
            }
            pos.y=by+BIG_SWITCH_height;
            break;
    }
    pos.x-=bx;pos.y-=by;
    return pos;
}
function setInitialBSPositions(){
    var bs_interfaces=[];
    var bs_x=svg_width/2-BIG_SWITCH_width/2,bs_y=svg_height/2-BIG_SWITCH_height/2;

    EP_list.forEach(function(ele,index){
        var tmp={};
        tmp.ref = "endpoint";
        tmp.id = "endpoint:"+ele.id;
        var pos=getPos(ele,bs_x,bs_y);
        tmp.x=pos.x;
        tmp.y=pos.y;
        bs_interfaces.push(tmp);
    });
    NF_list.forEach(function(ele1,index){
        ele1.ports.forEach(function(ele2,index){
            var tmp={};
            tmp.ref = "vnf";
            tmp.id_vnf= ele1.id;
            tmp.id = "vnf:"+ele1.id+":"+ele2.id;
            var temp={x:parseInt(ele2.parent_NF_x)+parseInt(ele2.x),y:parseInt(ele2.parent_NF_y)+parseInt(ele2.y)};
            var pos=getPos(temp,bs_x,bs_y);
            tmp.x=pos.x;
            tmp.y=pos.y;
            bs_interfaces.push(tmp);
        })
    });

    big_switch.x=bs_x;
    big_switch.y=bs_y;
    big_switch.interfaces=bs_interfaces;
}

function setInitialNFPositions(){
    var n=NF_list.length;
    var alfa=2*Math.PI/n;
    var x,y;
    for(var i=0;i<n;i++){
        x=parseInt(200*Math.cos(alfa*(i)+Math.PI/2)+svg_width/2-NF_width/2-NF_offset_x/2);
        NF_list[i].x=x;
        y=parseInt(200*Math.sin(alfa*(i)+Math.PI/2)+svg_height/2-NF_height/2-NF_offset_y/2);
        NF_list[i].y=y;
        NF_list[i].ports.forEach(function(e){
            //da aggiustare se si vogliono mettere equidistribuite attorno all'NF
            e.x=parseInt(Math.random()*NF_width);
            e.y=0;
            e.ref="NF_interface";
            e.parent_NF_x=x;
            e.parent_NF_y=y;
            e.parent_NF_id=NF_list[i].id;
            e.isLinked=false;
        })
    }
}

function setInitialEPPositions(){
    var n=EP_list.length;
    var alfa=2*Math.PI/n;
    for(var i=0;i<n;i++){
        EP_list[i].x=parseInt(250*Math.cos(alfa*(i))+svg_width/2);
        EP_list[i].y=parseInt(250*Math.sin(alfa*(i))+svg_height/2);
        EP_list[i].ref="end-point";
        EP_list[i].isLinked=false;
    }
}



/*
 --->>>DA FARE<<<--- COMPLETAMENTE DA RIFARE LE POSIZIONI LE TROVA DALL'OGGETTO JS NON DALL'HTML!
 */
function getLinkEndPositionById(id){
    //dato un id, devo ricavarmi la posizione di tale interfaccia
    //console.log(id);
    var data=id.split(":");
    var x,y;

    if(data[0]==="vnf"){
        //var id_mod=id.replace(/:/g,"\\:");
        //console.log("id_mod: "+id_mod);
        //console.log("qui");
        var NF_interface=getInterfaceById(id);
        var NF=getVNFById(data[1]);
        x=parseInt(NF_interface.x+parseInt(NF.x));
        y=parseInt(NF_interface.y+parseInt(NF.y));

        return {x:x,y:y};
    }else{
        if(data[0]==="endpoint"){

            var endpoint=getEndPointById(data[1]);

            x=parseInt(endpoint.x);
            y=parseInt(endpoint.y);
            //var id_mod=id.replace(/:/g,"\\:");
            //var EP_interface=svg.select("#"+id_mod);
            //var x=parseInt(EP_interface.attr("cx"));
            //var y=parseInt(EP_interface.attr("cy"));
            //console.log(x,y);

            return {x:x,y:y};
        }
    }
}
