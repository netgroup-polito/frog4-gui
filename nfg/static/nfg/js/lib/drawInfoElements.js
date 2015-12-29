/**
 *  In this file there are all the function needed for print on the left of the web page all the informations about the selected
 *  graphical object.
 *
 */




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
    $('#end'+endpoint.id).append('<p class="edit"><a href="#" onclick="showEditInfoEP(\''+endpoint.id+'\')"><strong><i class="glyphicon glyphicon-wrench"></i> Edit</strong></a></p>');
}

function drawVNFInfo(vnf,id){
    $('.info').empty();
    $('.info').append('<a href="#"><i class="glyphicon glyphicon-exclamation-sign"></i><strong> VNF Info</strong></a><div class="panel panel-default"><div class="panel-heading">VNF Id: '+vnf.id+' </div><div id="vnf'+vnf.id+'"class="panel-body"><p><b>Name:</b> '+vnf.name+'</p><p><b>Ports:</b></p></div><div>');

    vnf.ports.forEach(function(porta){
        $('#vnf'+vnf.id).append('<div class="panel panel-default"><div class="panel-body"><p><b>Port: </b>'+porta.id+'</p><p><b>Name: </b>'+porta.name+'</p></div></div>');
    });

    $('#vnf'+vnf.id).append('<p class="edit"><a href="#" onclick="showEditInfoVNF('+vnf.id+')"><strong><i class="glyphicon glyphicon-wrench"></i> Edit</strong></a></p>');


}

function drawLinkInfo(id){

    var flow_rule = getFlowRulesById(id);
    $('.info').empty();
    
    var $html='<a href="#"><i class="glyphicon glyphicon-exclamation-sign"></i><strong>Link Info</strong></a>'+
            '<div class="panel panel-default">'+
            '<div class="panel-heading">Info</div>'+
            '<div class="panel-body">'+
            '<p><b>Description: </b>'+flow_rule.description+'</p>'+
            '<p><b>Source Port: </b>'+flow_rule.match.port_in+'</p>'+
            '<p><b>Output: </b>'+flow_rule.actions[0].output+'</p>'+
            '</div>'+
            '</div>';
        $('.info').append($html);
        
}


function drawBigSwitchInfo(fg){
    $('.info').empty();
    $('.info').append('<a href="#" onclick="ReduceAll()"><strong>BigSwitch Info </strong><i class="glyphicon glyphicon-chevron-down" id="icon-bs"></i></a>');
    if(flow_rules.length===0){
        var $html='<a href="#"><i class="glyphicon glyphicon-exclamation-sign"></i><strong> No Items Selected</strong></a>'+
            '<div class="panel panel-default">'+
            '<div class="panel-heading">Info</div>'+
            '<div class="panel-body">'+
            '<p><b> No Flow-Rules</b></p>'+
            '</div>'+
            '</div>';
        $('.info').empty();
        $('.info').append($html);
    }else {
        flow_rules.forEach(function (e) {
            /*$html = '<div class="panel panel-default"><div class="panel-heading"><a onclick="Reduce('+e.id+')">FlowRule Id: '+e.id+' (';*/
            var $html = '<div class="panel panel-default" id="panel' + e.id + '"><div class="panel-heading" id="panel-h' + e.id + '"><a href="#" onclick="Reduce(\''+e.id+'\')">FlowRule (';

            $html += e.actions[0].output + " ";

            $html += ')</a></div><div id="flowrule' + e.id + '" class="panel-body"><p><b>Description: ' + e.description + '</b> </p><p><b>Priority: ' + e.priority + '</b> </p></div></div>';
            $('.info').append($html);
            $('#flowrule' + e.id).append('<p><b>Action:</b></p>');

            $('#flowrule' + e.id).append('<div class="panel panel-default" id="internal_panel' + e.id + '"><div id="a_' + e.id + '"class="panel-body"></div></div>');

            if (e.actions[0].output != null)
                $('#a_' + e.id).append('<p><b>Output: </b>' + e.actions[0].output + '</p>');


            /* aggiungere gli altri*/

            if (e.match.ether_type != null)
                $('#flowrule' + e.id).append('<p><b>EtherType: </b>' + e.match.ether_type + '</p>');
            if (e.match.protocol != null)
                $('#flowrule' + e.id).append('<p><b>Protocol: </b>' + e.match.protocol + '</p>');
            if (e.match.dest_port != null)
                $('#flowrule' + e.id).append('<p><b>Destination Port: </b>' + e.match.dest_port + '</p>');
            if (e.match.port_in != null)
                $('#flowrule' + e.id).append('<p><b>Source Port: </b>' + e.match.port_in + '</p>');

            /* aggiungere gli altri*/

            /* edit */
            $('#flowrule'+e.id).append('<br><p class="edit"><a href="#" onclick="showEditInfoFlowRule(\''+e.id+'\')"><strong><i class="glyphicon glyphicon-wrench"></i> Edit</strong></a></p>');

        });
    }

}

function ReduceAll(){
    if(isReduced===false){
        fg["forwarding-graph"]["big-switch"]["flow-rules"].forEach(function(e){
            $('#flowrule'+e.id).hide("slow");
        });
        $("#icon-bs").attr("class","glyphicon glyphicon-chevron-right");
        isReduced = true;
    }else{
        fg["forwarding-graph"]["big-switch"]["flow-rules"].forEach(function(e){
            $('#flowrule'+e.id).show("slow");
        });
        $("#icon-bs").attr("class","glyphicon glyphicon-chevron-down");
        isReduced = false;
    }
}




function Reduce(id){    
    $('#flowrule'+id).slideToggle("slow");    
}


/* This function draw a left pannel with ad information of how to start */

function drawAnyItems(){

    /* deselect any items */

    deselectAll();
    $('.info').empty();

    var $html = '<a href="#"><i class="glyphicon glyphicon-exclamation-sign"></i><strong> No Items Selected</strong></a>'+
            '<div class="panel panel-default">'+
            '<div class="panel-heading">How to Start</div>'+
            '<div class="panel-body">'+
                '<p><b><i class="glyphicon glyphicon-file" aria-hidden="true"></i> New Document</b></p>'+
                '<p><b><i class="glyphicon glyphicon-pencil" aria-hidden="true"></i> Enable Draw </b></p>'+
                '<p><b><i class="fa fa-circle" aria-hidden="true"></i> Draw End Point </b></p>'+
                '<p><b><i class="fa fa-square" aria-hidden="true"></i> Draw VNF </b></p>'+
                '<p><b><i class="fa fa-arrows-h" aria-hidden="true"></i> Draw Link </b></p>'+
                '<p><b><i class="fa fa-square-o fa-lg" aria-hidden="true"></i> Change View </b></p>'+
                '<p><b><span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> Save Graph on Server</b></p>'+
                '<p><b><span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span> Open Graph from Client</b></p>'+
                '<p><b><span class="fa fa-server fa-lg" aria-hidden="true"></span> Open Graph from Server</b></p>'+
                '<p><b><span class="glyphicon glyphicon-save" aria-hidden="true"></span> Preview Graph </b></p>'+
                '<p><b><span class="fa fa-paper-plane" aria-hidden="true"></span> Deploy ( Test ) </b></p>'+
                '<p><b>Press d or canc to delete an item</b></p>'+
            '</div>'+
            '</div>';



    $('.info').append($html);

}








