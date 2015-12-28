/**
 *
 * This file contains the functions for editing the VNF parameters (e.g. change name, add and delete vnf interface).
 *
 */



function FillFormEditVNF(idVNF){
    var template;
    var vnf;
    NF_list.forEach(function(ele){
        if(parseInt(ele.id) == idVNF){
            vnf = ele;
            return vnf;
        }
    });

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

        case "firewall-web":
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

        case "client_iptraf":
            console.log("iptraf");
            $("#seltemplateVNF").val("Iptraf");
            template = "iptraf";

    }
    $("#infoPort").empty();

    console.log("template ->>>: "+template);
    /* Template di default Firewall */
    $.ajax({ type: "GET",url: "/nfg/ajax_template_request/"+template+"/",
        success: function(data) {FuncEditSuccess(data,idVNF);} });



    /* change button name in "Save VNF" */

    $("#saveVNF").attr("onclick","updateVNF()");
    $("#saveVNF").html("Save VNF");

}

function FuncEditSuccess(data,idVNF){
    data = data.replace(/'/g,'"');
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
     var $html=
        '<div>'+
        '<div class="form-group" >'+
        '<label class="control-label col-sm-2" >Port Info:</label>'+
        '<div class="col-sm-10">'+
        '</div>'+
        '</div>';
    $html+=
        '<div id="listPort"><div class="row port-i">'+
            '<div class="col-md-4"><label class="port-id">Name:</label></div>'+
            '<div class="col-md-4"><label class="port-id">Id:</label></div>'+
            '<div class="col-md-4"></div>'+
        '</div>';
    vnf.ports.forEach(function(port){
        console.log(port.id);
        $html+='<div class="row port-i" id="delete'+port.fullId+'">'+
           '<div class="col-md-4"><label class="port-id" style="font-weight:normal;">'+port.name+'</label></div>'+
            '<div class="col-md-4"><label class="port-id">'+port.id+'</label></div>'+
            '<div class="col-md-4"><a href="#" onclick="deletePort(\''+port.fullId+"\',\'"+port.parent_NF_id+'\');"  ' +
            'class="btn btn-danger" >x</a></div>'+
            '</div>';
    });
    $html+='</div><div id="msgVNFPort"></div>';
    var labelList=[];
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
        '<div class="col-md-4"><input type="text" name="" class="form-control" placeholder="port name" id="newPortName"></div>'+

        
        '<div class="col-md-4"><div class="btn-group">'+
        '<button type="button" class="btn btn-default dropdown-toggle"  data-toggle="dropdown" name="type" aria-haspopup="true" aria-expanded="false" id="selectLabel"> Label <span class="caret"></span></button>'+
        '<ul class="dropdown-menu">';
    labelList.forEach(function(ele,i){
        $html+='<li><a href="#" id="option-'+ele.name+'" >'+ele.name+'</a></li>';
    });

    $html+='</ul></div><div class="btn-group">' +
        '<button type="button" class="btn btn-default dropdown-toggle"  data-toggle="dropdown" name="type" aria-haspopup="true" aria-expanded="false" id="selectPosition"> Id <span class="caret"></span></button>'+
        '<ul class="dropdown-menu" id="positionMenu"></ul>'+

        '</div></div>'+
        '<div class="col-md-4"><a href="#" id="addPortButton" onclick="addPortToVNF(\''+""+idVNF+'\');"  class="btn btn-primary" >+</a></div>'+
        '</div>';

    $("#infoPort").append($html);
    $('#selectPosition').prop('disabled', true);
    labelList.forEach(function(ele,i){
        jQuery('#option-'+ele.name).click(function(){
            console.log(this);
            var labelType = $(this).text();
            console.log(labelType);
            $('#selectLabel').text(labelType);
            var options='';
            $('#positionMenu').empty();
            $('#selectPosition').prop('disabled', false);
            var atLeasOne=false;
            labelList.forEach(function(label){
                if(label.name===labelType){
                    for(var i=0;i<label.pos_max-label.pos_min+1;i++){
                        if(!portIdIsAlreadyTaken("vnf:"+idVNF+":"+label.name+":"+i)){
                            options+='<li><a hfref="#" class="idSelect" id="idSelect'+i+'">'+i+'</a></li>';
                            atLeasOne=true;
                        }
                    }
                }
            });
            if(!atLeasOne){
                options+='<li><a hfref="#"> no ports available for this label</a></li>';
            }
            $('#positionMenu').append(options);
            $('.idSelect').click(function(){
                $('#selectPosition').text($(this).text());
            });
            //label.preventDefault();
        });
    });
}



function deletePort(portId,vnfId){
    var label=portId.split(":")[2];
    //check if is possible to delete (field min of template)
    var template_port=getTemplatePortByLabel(label);
    $("#msgVNFPort").empty();
    var n=getNumberOfPortWithLabelInVNF(label,vnfId);
    console.log("n: "+n);
    console.log("min: "+parseInt(template_port.min));
    if(n<=parseInt(template_port.min)){
        $("#msgVNFPort").text("You cannot delete this port for this template: min \""+label+"\" ports = "+parseInt(template_port.min));
        return;
    }
    var portId_mod=portId.replace(/:/g,"\\:");
    deletePortById(portId,vnfId);
    $('#delete'+portId_mod).remove();
}

function addPortToVNF(idVNF){

    var newPortName=$("#newPortName").val().trim();
    if(newPortName===undefined || newPortName===""){
        newPortName="Unnamed VNF Port";
    }
    var label=$("#selectLabel").text().trim();
    if(label===undefined || label==="Label"){
        return;
    }
    var positionId=$("#selectPosition").text().trim();
    if(positionId===undefined || positionId==="Id"){
        return;
    }
    var newInterfaceId=""+label+":"+positionId;
    var vnf=getVNFById(idVNF);
    console.log("vnf:");
    console.log(vnf);
    console.log(idVNF);
    //creating a new vnf port
    var newPort={
        fullId:"vnf:"+idVNF+":"+newInterfaceId,
        id:newInterfaceId,
        isLinked:false,
        name:newPortName,
        ref:"NF_interface",
        parent_NF_id:idVNF,
        parent_NF_x:vnf["x"],
        parent_NF_y: vnf["y"],
        x:Math.random()*NF_width,
        y:0
    };
    vnf.ports.push(newPort);
    var vect_port=[];
    vect_port.push(newPort);
    drawVNF_interfaces(vect_port);
    //creating a new bs port
    var newBSInt={};
    newBSInt.ref = "bsInt";
    newBSInt.id_vnf= vnf.id;
    newBSInt.id = "vnf:"+vnf.id+":"+newPort.id;
    newBSInt.fullId = "vnf:"+vnf.id+":"+newPort.id;
    newBSInt.x=117*Math.random()%BIG_SWITCH_width;
    newBSInt.y=0;
    var newBSInt_vect=[];
    newBSInt_vect.push(newBSInt);
    big_switch.interfaces.push(newBSInt);

    drawBSInterfaces(newBSInt_vect);
    //creating a new external bs link

    var newLink={};
    var new_bs_links=[];
    newLink.x1=parseInt(newPort.x)+newPort.parent_NF_x;
    newLink.y1=parseInt(newPort.y)+newPort.parent_NF_y;
    newLink.x2=newBSInt.x+big_switch.x;
    newLink.y2=newBSInt.y+big_switch.y;
    newLink.start=newBSInt.id;
    newLink.end="bs-"+newBSInt.id;
    newLink.external=true;

    new_bs_links.push(newLink);
    drawBSLinks(new_bs_links);

    var htmlNewPort='<div class="row port-i" id="delete'+newPort.fullId+'">'+
    '<div class="col-md-4"><label class="port-id" style="font-weight:normal;">'+newPort.name+'</label></div>'+
    '<div class="col-md-4"><label class="port-id">'+newPort.id+'</label></div>'+
    '<div class="col-md-4"><a href="#" onclick="deletePort(\''+newPort.fullId+"\',\'"+newPort.parent_NF_id+'\');"  ' +
    'class="btn btn-danger" >x</a></div>'+
    '</div>';
    $('#listPort').append(htmlNewPort);
    $('#selectPosition').text("Id");
    $('#positionMenu').empty();
    $('#selectLabel').text("Label");
    updateView();

}