/**
 * Created by pc asus on 05/12/2015.
 */




function FG_init(){
    console.log("isAlreadyPos :"+isAlreadyPositioned);
    if(!isAlreadyPositioned) {
        setRandomInitialNFPositions();
        setRandomInitialEPPositions();
        setRandomInitialBSPositions();
        
    }else{
        //settare con il file di posizionamento!!!
        setInitialEPPositions();
        setInitialNFPositions();
        setInitialBSPositions();

    }
    elaborateFlowRules();
    setBSExternalLink();
}

function elaborateFlowRules(){
    //funzione che
    // 1. arricchische il campo match e il campo action con la posizione delle corrispettive interfacce
    // 2. elimina l'info rindondante andata-ritorno, e setta un campo aggiuntivo che dice se è fullduplex o no

    flow_rules.forEach(function(fr,i){
        
        //0 setto un nuovo campo output
        fr["output"]=setOutputFlowRule(fr);
        //1 setto la posizione delle interfacce
        
        var pos=getLinkEndPositionById(fr["match"]["port_in"]);
        fr["match"]["interface_position_x"]=pos.x;
        fr["match"]["interface_position_y"]=pos.y;


        //console.log("match");
        /*
         --->>>DA FARE<<<--- da nodificare con un forEach
         */
        pos=getLinkEndPositionById(fr["actions"][0]["output"]);
        fr["actions"][0]["interface_position_x"]=pos.x;
        fr["actions"][0]["interface_position_y"]=pos.y;

        //console.log(pos.x,pos.y);

        //2. cerco all'interno di flow_rules se c'è il suo duale, se no setto fullduplex a false;
        //--->>>DA FARE<<<--- SE è FULL DUPLEX OCCORRE NON AGGIUNGERE UNA SECONDA VOLTA UNA LINEA!
        if(fr["double"]===undefined) {
            fr["full_duplex"] = false;
            for (var j = i; j < flow_rules.length; j++) {
                if (fr["match"]["port_in"] === flow_rules[j]["actions"][0]["output"] && fr["actions"][0]["output"] == flow_rules[j]["match"]["port_in"]) {
                    fr["full_duplex"] = true;
                    flow_rules[j]["double"] = true;
                    flow_rules[j]["full_duplex"]=true;
                    break;
                }
            }
        }


        //3 aggiunco alla lista delle interfacce del bs 2 nuovi elementi:
        //var bs_x=300,bs_y=200;
        //var int1={id:"bs-"+fr["match"]["port_in"],x:parseInt(Math.random()*BIG_SWITCH_width),y:0};
        //var int2={id:"bs-"+fr["action"]["output"],x:parseInt(Math.random()*BIG_SWITCH_width),y:0};
        //big_switch.interfaces.push(int1);
        //big_switch.interfaces.push(int2);

    });
    //flow_rules= _.filter(flow_rules,function(e){return e["double"]!==undefined || e["full_duplex"]===false;});
    flow_rules.forEach(function(fr){
        var int1=getBSInterfaceById(fr["match"]["port_in"]);
        var int2=getBSInterfaceById(fr["actions"][0]["output"]);


        var link2={
            id: fr.id,
            x1: int1.x + big_switch.x,
            y1: int1.y + big_switch.y,
            x2: int2.x + big_switch.x,
            y2: int2.y + big_switch.y,
            start: "bs-"+int1.id,
            end: "bs-"+int2.id,
            full_duplex: fr["full_duplex"]
        };

        bs_links.push(link2);

        var start_id=[],end_id=[];
        start_id=fr["match"]["port_in"].split(":");
        end_id=fr["actions"][0]["output"].split(":");
        var start_int,end_int;
        if(start_id[0]==="vnf"){
            start_int=getInterfaceById(fr["match"]["port_in"]);
        }else if(start_id[0]==="endpoint"){
            start_int=getEndPointById(start_id[1]);
        }
        if(end_id[0]==="vnf"){
            end_int=getInterfaceById(fr["actions"][0]["output"]);
        }else if(end_id[0]==="endpoint"){
            end_int=getEndPointById(end_id[1]);
        }
        if(start_int.isLinked===false){
            start_int.isLinked=true;
        }else{//è già false
            isSplitted=true;
            console.log("POSSIBILE SOLO VISTA IN BS!!!");
            updateView();
            //showBigSwitch
        }
        if(end_int.isLinked===false){
            end_int.isLinked=true;
        }else{//è già false
            isSplitted=true;
            console.log("POSSIBILE SOLO VISTA IN BS!!!");
            updateView();
            //showBigSwitch
        }


    });
}
function setBSExternalLink(){
    big_switch.interfaces.forEach(function(bs_int){
        var id_split=[];
        id_split=bs_int.id.split(":");
        var x1,y1,id;

        var int1;
        if(id_split[0]==="vnf"){
            int1=getInterfaceById(bs_int.id);
            x1=int1.x+int1.parent_NF_x;
            y1=int1.y+int1.parent_NF_y;
            id="vnf:"+int1.parent_NF_id+":"+int1.id;
        }else{
            int1=getEndPointById(id_split[1]);
            x1=int1.x; y1=int1.y; id="endpoint:"+int1.id;

        }

        var link1={
            x1: x1,
            y1: y1,
            x2: bs_int.x+big_switch.x,
            y2: bs_int.y+big_switch.y,
            start: id,
            end: "bs-"+bs_int.id,
            external:true
            //full_duplex: fr["full_duplex"]
        };

        bs_links.push(link1);
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
 console.log(min);
    switch (min){
        case d1:
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
function setRandomInitialBSPositions(){
    var bs_interfaces=[];
    var bs_x=svg_width/2-BIG_SWITCH_width/2,bs_y=svg_height/2-BIG_SWITCH_height/2;

    EP_list.forEach(function(ele,index){
        var tmp={};
        tmp.ref = "bsInt";
        tmp.id = "endpoint:"+ele.id;
        var pos=getPos(ele,bs_x,bs_y);
        tmp.x=pos.x;
        tmp.y=pos.y;
        bs_interfaces.push(tmp);
    });
    NF_list.forEach(function(ele1,index){
        ele1.ports.forEach(function(ele2,index){
            var tmp={};
            tmp.ref = "bsInt";
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

function setRandomInitialNFPositions(){
    var n=NF_list.length;
    var alfa=2*Math.PI/n;
    var x,y;
    for(var i=0;i<n;i++){
        x=parseInt(200*Math.cos(alfa*(i)+Math.PI/2)+svg_width/2-NF_width/2-NF_offset_x/2);
        NF_list[i].x=x;
        y=parseInt(200*Math.sin(alfa*(i)+Math.PI/2)+svg_height/2-NF_height/2-NF_offset_y/2);
        NF_list[i].y=y;
        NF_list[i].ref="vnf";
        NF_list[i].ports.forEach(function(e){
            //da aggiustare se si vogliono mettere equidistribuite attorno all'NF
            e.x=parseInt(Math.random()*NF_width);
            e.y=0;
            e.ref="NF_interface";
            e.fullId= "vnf:"+NF_list[i].id+":"+ e.id;
            e.parent_NF_x=x;
            e.parent_NF_y=y;
            e.parent_NF_id=NF_list[i].id;
            e.isLinked=false;
        });
    }
}

function setRandomInitialEPPositions(){
    var n=EP_list.length;
    var alfa=2*Math.PI/n;
    for(var i=0;i<n;i++){
        EP_list[i].x=parseInt(250*Math.cos(alfa*(i))+svg_width/2);
        EP_list[i].y=parseInt(250*Math.sin(alfa*(i))+svg_height/2);
        EP_list[i].ref="end-point";
        EP_list[i].fullId="endpoint:"+EP_list[i].id;
        EP_list[i].isLinked=false;
    }
}

function setInitialNFPositions(){
    var nf_list = fg_pos["VNFs"];
    
    for (var i=0;i<nf_list.length;i++){
        var vnf = getVNFbyIdPos(NF_list[i].id)

        NF_list[i].x = vnf.x;
        NF_list[i].y = vnf.y;
        NF_list[i].ref="vnf";

        NF_list[i].ports.forEach(function(e){
            var port = getPortVnfbyId(vnf,e.id);
            e.x = port.x;
            e.y = port.y;
            e.ref="NF_interface";
            e.fullId= "vnf:"+NF_list[i].id+":"+ e.id;
            e.parent_NF_x=vnf.x;
            e.parent_NF_y=vnf.y;
            e.parent_NF_id=NF_list[i].id;
            e.isLinked=false;

        });
    }
}

function setInitialEPPositions(){
    for(var i=0;i<EP_list.length;i++){
        var ep = getEndPointbyIdPos(EP_list[i].id);
        EP_list[i].x = ep.x;
        EP_list[i].y = ep.y;
        EP_list[i].ref = "end-point";
        EP_list[i].fullId="endpoint:"+EP_list[i].id;
        EP_list[i].isLinked = false;
        console.log(ep.x+" - "+ep.y);
    }
}

function setInitialBSPositions(){
    var bs_interfaces=[];
    var big = getBS();

    big_switch.x = big.x;
    big_switch.y = big.y;

    EP_list.forEach(function(ele){
        var tmp={};
        tmp.ref = "bsInt";
        tmp.id = "endpoint:"+ele.id;
        tmp.fullId=tmp.id;

        var inter = getBSInterfaceByIdPos(tmp.id);
        tmp.x=inter.x;
        tmp.y=inter.y;
        bs_interfaces.push(tmp);
    });

    NF_list.forEach(function(ele1,index){
        ele1.ports.forEach(function(ele2,index){
            var tmp={};
            tmp.ref = "bsInt";
            tmp.id_vnf= ele1.id;
            tmp.id = "vnf:"+ele1.id+":"+ele2.id;
            tmp.fullId=tmp.id;
            var inter = getBSInterfaceByIdPos(tmp.id);
            tmp.x=inter.x;
            tmp.y=inter.y;
            bs_interfaces.push(tmp);
        })
    });

    big_switch.interfaces=bs_interfaces;

}



