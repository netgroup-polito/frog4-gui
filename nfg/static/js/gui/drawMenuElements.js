/**
 *  This file contains the functions for creating new EP and VNF, (creating a new Link is implemented in "linkCreations.js").
 *
 **/


//template of End Point with types
var epTemplateList
var currentEP

function drawNewEP(){
    var ele=[];

    var ep = fillNewEP();
    ep.fullId="endpoint:"+ep.id;
    ep.ref="end-point";
    ep.isLinked=false;
    console.log(validateNewEndPoint(ep));
    if(validateNewEndPoint(ep)) {
        isModified = true;
        setKeysWindowListener();
        $('#FormEP').modal('hide');
        setKeysWindowListener();
        ele.push(ep);

        /* the new ep created is added to the EP_list */
        EP_list.push(ele[0]);

        /* creating a new bs_interfaces and add it to the bs interfaces list*/
        var new_bs_int = {};
        new_bs_int.ref = "bsInt";
        new_bs_int.id = "endpoint:" + ep.id;
        new_bs_int.fullId = new_bs_int.id;
        new_bs_int.x = 0;
        new_bs_int.y = 0;
        big_switch.interfaces.push(new_bs_int);

        /*draw new EP*/
        drawEP(ele);

        drawSingleBSInterfaceAndExternalLink(new_bs_int, ep);

        updateView();
        updateTooltips();
    }
    else{
        console.log("validazione fallita");
    }

}



function drawNewNF(){
    isModified=true;
    var vnf = fillNewVNF();
    $('#FormNF').modal('hide');
    setKeysWindowListener();

    var new_int=[];
    var new_bs_links=[];

    vnf.ports.forEach(function(port,i){

        port.x=22*i%NF_width;
        port.y=parseInt(port.y);
        port.parent_NF_x=parseInt(port.parent_NF_x);
        port.parent_NF_y=parseInt(port.parent_NF_y);
        port.ref="NF_interface";
        port.fullId="vnf:"+vnf.id+":"+port.id;
        /* creating a new bs_interfaces and add it to the bs interfaces list*/
        var newBSInt={};
        newBSInt.ref = "bsInt";
        newBSInt.id_vnf= vnf.id;
        newBSInt.id = "vnf:"+vnf.id+":"+port.id;
        newBSInt.fullId = "vnf:"+vnf.id+":"+port.id;

        newBSInt.x=22*i%BIG_SWITCH_width;
        newBSInt.y=0;

        var newLink={};
        newLink.x1=parseInt(port.x)+port.parent_NF_x;
        newLink.y1=parseInt(port.y)+port.parent_NF_y;
        newLink.x2=newBSInt.x+big_switch.x;
        newLink.y2=newBSInt.y+big_switch.y;
        newLink.start=newBSInt.id;
        newLink.end="bs-"+newBSInt.id;
        newLink.external=true;

        new_bs_links.push(newLink);
        new_int.push(newBSInt);
        big_switch.interfaces.push(newBSInt);
    });
    /*add to the  list of VNF the new element*/
    NF_list.push(vnf);


    var ele = [];   ele.push(vnf);

    drawNF_text(ele);

    drawNF(ele);

    drawVNF_interfaces(ele[0].ports);

    /*add the new bs interface*/
    drawBSInterfaces(new_int);


    /*draw the link between BS interfaces and VNF interfaces*/
    drawBSLinks(new_bs_links);

    updateView();
    updateTooltips();

}
function saveNewEp(){

    var ep = updateEP();
    if(validateNewEndPoint(ep)==true){
        $('#FormEP').modal('hide');
        setKeysWindowListener();
        EP_list.forEach(function(ele,index){
            if(parseInt(ele.id) == parseInt(ep.id)){
                EP_list[index]=ep;                
                console.log("trovato");
                console.log(ele);
            }
        });


    }
    drawEndPointInfo(ep,ep.id);

    console.log(validateNewEndPoint(ep));

}

function saveNewVNF(){
    var vnf = updateVNF();
    NF_list.forEach(function(ele,index){
        if(parseInt(ele.id) == parseInt(vnf.id)){
            NF_list[index]=vnf;
            console.log(ele);
        }
    })
}

function loadEPInfo() {

     $.ajax({
             url: 'view_ep_request/',
              type: 'GET'
              }).done(function(data1){
                    epTemplateList=JSON.parse(data1);
                    console.log(epTemplateList);
                    onClickDrawEP()
                 });
    
}



function fillInEP(epType) {
    var $html='';
    $("#epInfo").empty();

    var ep;
    ep = getEndPointById($("#idEndPoint").val());


    for(var j=0; j<epTemplateList.length; j++)
            if(epTemplateList[j].type===epType){
                currentEP=epTemplateList[j];
                break;
            }


    for (var t in currentEP["properties"]){



        $html+='<div class="form-group">'+
                            '<label class="control-label col-sm-2" for="expandable">'+t+":"+'</label>'+
                            '<div class="col-sm-10">'+
                                '<input type="text" name="idVNF" class="form-control " id="id'+t+'" placeholder="" >'+
                            '</div>'+
                        '</div>';
    }

     $("#epInfo").append($html);



}




function onClickDrawEP(){


        $('#selectEPItems').empty();


        var $html = '<select class="form-control" name="type" id="seltypeEP" onchange="fillInEP(this.value)">';


        for(var i=0; i< epTemplateList.length; i++){

            if(i==0){
                $html+='<option selected>'+epTemplateList[i].type+'</option>';
                fillInEP(epTemplateList[i].type);
            }
            else
            $html+='<option>'+epTemplateList[i].type+'</option>';

        }


         $html+='</select>';
        $('#selectEPItems').append($html);







        $('#FormEP').modal('show');
        unSetKeysWindowListener();

        $("#idEndPoint").val(NextIdEP());


        $("#saveEP").attr("onclick","drawNewEP()");
        $("#saveEP").html("Add End Point");
}

function onClickDrawVNF(){

    $('#FormNF').modal('show');
    unSetKeysWindowListener();
    $("#nameVNF").val("");
    $('#seltemplateVNF' ).val('Firewall');

    $("#idVNF").val(NextIdVNF());
    $("#saveVNF").attr("onclick","drawNewNF()");
    $("#saveVNF").html("Add VNF");
    $('#seltemplateVNF').removeAttr('disabled');

    /* Default Firewall Template */
    $.ajax({ type: "GET",url: "/ajax_template_request/all/",
        success: function(data) {
            console.log(data);
            FuncSuccess(data);} });

}

function onClickDrawLink(){
    $('#newLinkButton').attr("class","btn btn-warning btn-lg drawButton");
    $("#my_canvas").css("cursor","crosshair");
    ele1_selected=undefined;
    ele2_selected=undefined;
    creating_link=true;

}