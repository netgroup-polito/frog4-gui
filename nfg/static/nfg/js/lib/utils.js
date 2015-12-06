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
/* funzioni per leggere dal file di posizionamento */

function getVNFbyIdPos(id){
    var vnf ={};
    var vnf_list = fg_pos["VNFs"];

    vnf_list.forEach(function(ele){
        if(ele.id == id) vnf = ele; 
    });

    return vnf; 
}

function getEndPointbyIdPos(id){
    var endpoint={};
    var ep_list = fg_pos["end-points"];

    ep_list.forEach(function(ele){
        if(ele.id == id) endpoint = ele;
    });

    return endpoint;
}

function getBSInterfaceByIdPos(id){
    var inter = {};
    var interfaces = fg_pos["big-switch"]["interfaces"];

    interfaces.forEach(function(ele){
        if(ele.id == id) inter = ele;
    });

    return inter;
}

function getPortVnfbyId(vnf,id){
    var ports = vnf["ports"];
    var port = {};

    ports.forEach(function(ele){
        if(ele.id == id) port = ele;
    });

    return port;

}


function getBS(){
    var big = {};
    big = fg_pos["big-switch"];

    return big;
}





