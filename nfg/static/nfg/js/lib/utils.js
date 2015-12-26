/**
 * This file contains generic utility functions.
 *
 **/


/* This function return a vnf given an id */

function getVNFById(id){
    var vnf=undefined;
    NF_list.forEach(function(e){
        if(e.id == id){ vnf=e;}
    });
    return vnf;
}

/* This function return an end-point given an id */

function getEndPointById(id){
    var endpoint=undefined;
    EP_list.forEach(function(e){
        if (e.id == id) {endpoint=e;}
    });
    return endpoint;
}

/* This function return an end-point given a complete id */

function getEndPointByCompleteId(fullId){
    var chunk=fullId.split(":");
    return getEndPointById(chunk[1]);
}

/* This function return an BS-interface given an id */

function getBSInterfaceById(id){
    var inter=undefined;
    big_switch.interfaces.forEach(function(e){
        if(e.id==id){   inter=e;    }
    });
    return inter;
}

function getTemplatePortByLabel(name){
    var port=undefined;
    console.log("------>"+name);
    if(template_js===undefined) return;
    template_js.ports.forEach(function(p){
        if(p.label===name){
            port=p;
        }
    });
    return port;
}
function getNumberOfPortWithLabelInVNF(label,vnfId){
    console.log(vnfId);
    var vnf=getVNFById(vnfId);
    var count=0;
    vnf.ports.forEach(function(port){
        var tmp_label=port.id.split(":")[0];
        if(tmp_label===label){
            count++;
        }
    });
    return count;
}


/* This function return an flow-rule given an id */

function getFlowRulesById(id){
    var flowrule=undefined;
    flow_rules.forEach(function(e){
        if(e.id === id){ flowrule=e;}
    });
    return flowrule;
}

function getInterfaceById(id){
    var interface=undefined;
    var data=id.split(":");
    NF_list.forEach(function(nf){
        if(nf.id == data[1]){ nf["ports"].forEach(function(i){ if(i.id==data[2]+":"+data[3]) interface=i;}); }
    });
    return interface;
}

function getLinkEndPositionById(id){
    var data=id.split(":");
    var x=undefined,y=undefined;
    if(data[0]==="vnf"){
        var NF_interface=getInterfaceById(id);
        var NF=getVNFById(data[1]);
        x=parseInt(NF_interface.x+parseInt(NF.x));
        y=parseInt(NF_interface.y+parseInt(NF.y));
    }else if(data[0]==="endpoint"){
            var endpoint=getEndPointById(data[1]);
            x=parseInt(endpoint.x);
            y=parseInt(endpoint.y);
    }else{
        console.log("Errore!");
    }
    return {x:x,y:y};
}

/* functions to read position json file: */

/* This function return the VNF position given an id */

function getVNFbyIdPos(id){
    var vnf ={};
    var vnf_list = fg_pos["VNFs"];

    vnf_list.forEach(function(ele){
        if(ele.id == id) vnf = ele; 
    });

    return vnf; 
}

/* This function return the EndPoint position given an id */

function getEndPointbyIdPos(id){
    var endpoint={};
    var ep_list = fg_pos["end-points"];

    ep_list.forEach(function(ele){
        if(ele.id == id) endpoint = ele;
    });

    return endpoint;
}

/* This function return the BS-interface position given an id */

function getBSInterfaceByIdPos(id){
    var inter = {};
    var interfaces = fg_pos["big-switch"]["interfaces"];

    interfaces.forEach(function(ele){
        if(ele.id == id) inter = ele;
    });

    return inter;
}

/* This function return the VNF port position given an id */

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


function isDuplex(sourceId,destId){
    var d=false;
    flow_rules.forEach(function(fr){
        if(fr["actions"][0]["output"]===sourceId && fr["match"]["port_in"]===destId){
            
            d=true;
            var id_start_mod=sourceId.replace(/:/g,"\\:");
            var id_end_mod=destId.replace(/:/g,"\\:");
            fr["full_duplex"]=true;
            lines_section.selectAll(".line[start="+id_end_mod+"][end="+id_start_mod+"]")
                .attr("marker-end","default")
                .attr("fullduplex","true");
            lines_section.selectAll(".BS-line[start=bs-"+id_end_mod+"][end=bs-"+id_start_mod+"]")
                .attr("marker-end","default")
                .attr("fullduplex","true");
        }
    });
    return d;
}

function checkSplit(){
    isSplitted=false;
    for(var i=0;i<flow_rules.length;i++){
        for(var j=i+1;j<flow_rules.length;j++){
            if(
                flow_rules[i]["match"]["port_in"]===flow_rules[j]["match"]["port_in"] ||
                flow_rules[i]["match"]["port_in"]===flow_rules[j]["actions"][0]["output"] ||
                flow_rules[i]["actions"][0]["output"]===flow_rules[j]["match"]["port_in"] ||
                flow_rules[i]["actions"][0]["output"]===flow_rules[j]["actions"][0]["output"]
            ){
                isSplitted=true;
                console.log("SPLITTT");
                flow_rules[i]["double"]=true;
                flow_rules[j]["double"]=true;
            }
        }
    }
    updateView();
}

function showVNFPorts(){
    var vnf=selected_node;
    var htmlInsertions="";
    htmlInsertions+="<table class='table table-bordered'>";
    htmlInsertions+="<tr><th>port id</th><th></th>"
    for(var i=0;i<vnf.ports.length;i++){
        htmlInsertions+=
            "<tr>" +
                "<th>"+vnf.ports[i].id+"</th>" +
                "<td><div onclick='removePort("+vnf.ports[i].id+"' >" +
                    "<button type='button' class='btn btn-default btn-lg'><span class='glyphicon glyphicon-minus' aria-hidden='true'></span></button>"
                "</td>" +
            "</tr>";
    }

    htmlInsertions+="</table>";

    $("#showPorts").append(htmlInsertions)
}

function getDualFR(id){
    var flowRule=getFlowRulesById(id);
    var fr=getFRByPoints(flowRule["actions"][0]["output"],flowRule["match"]["port_in"]);
    return fr;
}
function getFRByPoints(start,end){
    var retFR=undefined;
    flow_rules.forEach(function(fr){
        if(fr["actions"][0]["output"]===end && fr["match"]["port_in"]===start){
            retFR=fr;
        }
    });
    return retFR;
}


function setKeysWindowListener(){
    d3.select(window)
        .on("keydown",keyDown)
        .on("keyup",keyUp);

}
function unSetKeysWindowListener(){
    d3.select(window)
        .on("keydown",null)
        .on("keyup",null);    
}

function updateTooltips(){
    $(".BS_interface").tooltip({
        'container': 'body',
        'placement': 'top'
    });

    $(".BS-line").tooltip({
        'container': 'body',
        'placement': 'top'
    });

    $(".end-points").tooltip({
        'container': 'body',
        'placement': 'top'
    });

    $(".menu").tooltip({
        'container': 'body',
        'placement': 'top'
    });
}

function disableTooltip(){
    $(".tooltip").remove();
}

function newForwardingGraph(){
    console.log(isModified);
    if(isModified){
        //messaggio di conferma
        showSaveForm("Do you want to save it first?");
    }else{
        eraseAll();
    }
    

}

/* this function shows a flow rule given an id */

function highlightsFlowRule(id){
    console.log(id);
    $('#panel'+id).attr("class","panel panel-info-select");
    $('#panel-h'+id).attr("class","panel-heading panel-h-info-select panel-heading ");
    $('#internal_panel'+id).attr("class","panel panel-info-select");

}

function setOutputFlowRule(fr){
    var output;
    fr.actions.forEach(function(d){
        if(d.output!==undefined){
            output= d.output;
        }
    });
    return output;
}

function setPointerAtLines(){
    $(".BS-line,.line,.BS-line-selected,.line-selected").css("cursor","pointer");
}

function portIdIsAlreadyTaken(id){
    var ris=getInterfaceById(id);
    if(ris===undefined){
        return false;
    }else{
        return true;
    }
}