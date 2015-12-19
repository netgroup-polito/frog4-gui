/**
 * Created by pc asus on 14/12/2015.
 */


var labelList=[];

function FillFormEditVNF(idVNF){
    var template;
    var vnf;
    NF_list.forEach(function(ele){
        if(parseInt(ele.id) == idVNF){
            vnf = ele;
            return vnf;
        }
    });

    /* rec1perato vnf da modificare */
    console.log(vnf);
    console.log(vnf.id);
    $("#idVNF").val(vnf.id);
    $("#nameVNF").val(vnf.name);
    $('#seltemplateVNF').attr('disabled', true);
    console.log(vnf.vnf_template);

    switch(vnf.vnf_template){
        case "firewall":
            console.log("firewall");
            $('#seltemplateVNF' ).val('Firewall');
            template = "firewall";
            break;

        case "firewall_web":
            console.log("firewall-web");
            $("#seltemplateVNF").val("Firewall-web");
            template = "firewall_web";
            break;

        case "ftp":
            console.log("ftp");
            $("#seltemplateVNF").val("Ftp");
            template = "ftp";
            break;

        case "nat":
            console.log("nat");
            $("#seltemplateVNF").val("Nat");
            template = "nat";
            break;

        case "dhcp":
            console.log("dhcp");
            $("#seltemplateVNF").val("Dhcp");
            template = "dhcp";
            break;

        case "switch":
            console.log("switch");
            $("#seltemplateVNF").val("Switch");
            template = "switch";
            break;

        case "iptraf":
            console.log("iptraf");
            $("#seltemplateVNF").val("Iptraf");
            template = "iptraf";

    }
    $("#infoPort").empty();

    /* Template di default Firewall */
    $.ajax({ type: "GET",url: "/nfg/ajax_template_request/"+template+"/",
        success: function(data) {FuncEditSuccess(data,idVNF);} });



    /* cambio il bottone in save */

    $("#saveVNF").attr("onclick","updateVNF()");
    $("#saveVNF").html("Save VNF");

}

function FuncEditSuccess(data,idVNF){
    data = data.replace(/'/g,'"');
    /* definisco oggetto fg */
    template_js=JSON.parse(data);
    console.log(template_js);
    fillTemplateVNF(template_js);
    $('#infoPort').empty();
    addEditFormPort(idVNF);
}
function addEditFormPort(idVNF){

    var vnf=getVNFById(idVNF);
    console.log(vnf);
    var port_template = template_js.ports;
    $("#infoPort").empty();
    $("#selectPosition").empty();
    $("#selectLabel").empty();
    //$html = '<div class="boxPort">'+
    //    '    <div class="form-group">'+
    //    '        <label class="control-label col-sm-2" for="title" id="titleInterface"><a>Ports info:</a></label>'+
    //    '        <div class="col-sm-10">'+
    //    '    </div>'+
    //    '</div>';
     $html=
        '<div>'+
        '<div class="form-group" >'+
        '<label class="control-label col-sm-2" >Port Info:</label>'+
        '<div class="col-sm-10">'+
        '</div>'+
        '</div>';
    vnf.ports.forEach(function(port){
        console.log(port.id);
        $html+='<div class="row port-i" id="delete'+port.fullId+'">'+
            '<div class="col-md-4"></div>'+
            '<div class="col-md-4"><label class="port-id">'+port.id+'</label></div>'+
            '<div class="col-md-4"><a href="#" onclick="deletePort(\''+port.fullId+"\',\'"+port.parent_NF_id+'\');"  ' +
            'class="btn btn-danger" >x</a></div>'+
            '</div>';
    });



    template_js.ports.forEach(function(e){
        var label={};
        label.name=e["label"];
        var pos=e["position"];
        var pos_split=pos.split("-");
        label.pos_min=parseInt(pos_split[0]);
        if(pos_split[1]==='N'){
            label.pos_max=62;
        }else{
            label.pos_max=parseInt(pos_split[1]);
        }
        label.min=e["min"];
        labelList.push(label);
    });
    $html+=
        '<div>'+
        '<div class="form-group" >'+
        '<label class="control-label col-sm-2" >Add New Port:</label>'+
        '<div class="col-sm-10">'+
        '</div>'+
        '</div>'+
        '<div class="row port-i">'+
        '<div class="col-md-4"><input type="text" name="" class="form-control" id="" placeholder="port name" ></div>'+

        '<div class="col-md-2">'+
        '<select class="form-control" name="type" id="selectLabel">';
    labelList.forEach(function(ele,i){
        $html+='<option id="option-'+ele.name+'" >'+ele.name+'</option>';
    });
    $html+='</select></div><div class="col-md-2">';

    $html+='<select class="form-control" name="type" id="selectPosition"></select></div>';
    $html+='<div class="col-md-4"><a href="#" id="add_port" onclick="addPort()"  class="btn btn-primary" >+</a></div>';
    //da mettere a posto

    
    $("#infoPort").append($html);
    labelList.forEach(function(ele,i){
        jQuery('#option-'+ele.name).click(setOptionsTemplateValues);
    });

}

function setOptionsTemplateValues(){
    var labelType = $("#selectLabel").val();
    console.log(labelType);
    options="";

    $("#selectPosition").empty();
    labelList.forEach(function(label){
        if(label.name===labelType){
            for(var i=0;i<label.pos_max-label.pos_min+1;i++){
                options+='<option>'+i+'</option>';
            }
        }
    });
    $('#selectPosition').append(options);
    
}


function deletePort(portId,vnfId){
    var portId_mod=portId.replace(/:/g,"\\:");
    deletePortById(portId,vnfId);
    $('#delete'+portId_mod).remove();
}

function addPort(){


    console.log(this);
}