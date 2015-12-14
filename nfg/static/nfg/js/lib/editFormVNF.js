/**
 * Created by pc asus on 14/12/2015.
 */

function FillFormEditVNF(idVNF){
    console.log("ciao dani!!!");
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
    //drawFormVNF();
    console.log(vnf.vnf_template);

    switch(vnf.vnf_template){
        case "firewall.json":
            console.log("firewall");
            $('#seltemplateVNF' ).val('Firewall');
            template = "firewall";
            break;

        case "firewall_web.json":
            console.log("firewall-web");
            $("#seltemplateVNF").val("Firewall-web");
            template = "firewall_web";
            break;

        case "ftp.json":
            console.log("ftp");
            $("#seltemplateVNF").val("Ftp");
            template = "ftp";
            break;

        case "nat.json":
            console.log("nat");
            $("#seltemplateVNF").val("Nat");
            template = "nat";
            break;

        case "dhcp.json":
            console.log("dhcp");
            $("#seltemplateVNF").val("Dhcp");
            template = "dhcp";
            break;

        case "switch.json":
            console.log("switch");
            $("#seltemplateVNF").val("Switch");
            template = "switch";
            break;

        case "iptraf.json":
            console.log("iptraf");
            $("#seltemplateVNF").val("Iptraf");
            template = "iptraf";

    }
    $("#infoPort").empty();

    /* Template di default Firewall */
    $.ajax({ type: "GET",url: "/nfg/ajax_template_request/"+template+"/",
        success: function(data) {FuncEditSuccess(data,idVNF);} });



    /* cambio il bottone in save */

    $("#saveVNF").attr("onclick","saveNewVNF()");
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

    //$html = '<div class="boxPort">'+
    //    '    <div class="form-group">'+
    //    '        <label class="control-label col-sm-2" for="title" id="titleInterface"><a>Ports info:</a></label>'+
    //    '        <div class="col-sm-10">'+
    //    '    </div>'+
    //    '</div>';
     $html=
        '<div>'+
        '<div class="form-group" >'+
        '<label class="control-label col-sm-2" for="swap">Port Info:</label>'+
        '<div class="col-sm-10">'+
        '</div>'+
        '</div>';
    vnf.ports.forEach(function(port){
        console.log(port.id);
        $html+=
        '<form class="form-inline">'+
            '<div class="form-group" >'+
                '<label  for="swap">'+port.id+'</label>'+



        ' <a href="#" id="prova" onclick="deletePort('+port.fullId+')"  class="btn btn-danger" >x</a></div></form>';
    });
    var labelList=[];
    template_js.ports.forEach(function(e){
        var label={};
        label.name=e["label"];
        var pos=e["position"];
        var pos_split=pos.split("-");
        label.pos_min=pos_split[0];
        label.pos_max=pos_split[1];
        label.min=e["min"];
        labelList.push(label);
    });
    $html+=
        '<form class="form-inline">'+
        '<div class="form-group" >'+
        '<input type="text" name="" class="form-control" id="" placeholder="port name" >'+


        '<select class="form-control" name="type" id="selectLabel">';
    labelList.forEach(function(ele,i){
        $html+='<option ';
        if(i===0){ $html+='selected';}
        $html+='>'+ele+'</option>';
    });

    $html+=
        '</select>'+
        '<select class="form-control" name="type" id="selectPosition">';

        //'<option selected>option1</option>'+
        //'<option selected>option2</option>'+

    for(function(ele,i){
        $html+='<option ';
        if(i===0){ $html+='selected';}
        $html+='>'+ele+'</option>';
    });
        $html+='</select>'+
        '<a href="#" id="prova" onclick=""  class="btn btn-primary" >add</a>'+


        '</div>'+
        '</form>'+


        '</div>'+
        '</div>';
    //da mettere a posto


    $("#infoPort").append($html);
}