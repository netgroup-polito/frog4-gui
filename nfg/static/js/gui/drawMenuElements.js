/**
 *  This file contains the functions for creating new EP and VNF, (creating a new Link is implemented in "linkCreations.js").
 *
 **/


//template of End Point with types
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


//------save locale/remote-----------
function saveGraphLocal(){
    console.log("saveGraphLocal()");
    $("#saveTitle").text("Save local file as...");
    $("#SaveForm").click(saveLocal);
    $("#EraseWithoutSaving").hide();
    $("#SaveFG").modal("show");
}
function saveGraphRemote(){
    console.log("saveGraphRemote()");
    //showSaveForm();
    $("#saveTitle").text("Save remote file as...");
    $("#SaveForm").click(saveRemote);
    $("#EraseWithoutSaving").hide();
    $("#SaveFG").modal("show");
}

function  saveRemote() {
    console.log("myFunctionRemote()");
}

function saveLocal () {
    var t;
    console.log("saveLocal()");
    var file_name = $("#nameFile").val();
    $("#SaveFG").modal("hide");
    console.log(file_name);
    var json_data = serialize_fg();

    $.ajax({
        url: 'graph_to_file_request/',
        type: 'POST',
        data: { "file_name_fg_local":file_name,"json_data":json_data} // file inputs.

    }).done(function(data){

        var res=JSON.parse(data);
        showMessageServer(res);


    }).fail(function(data){

        var res=JSON.parse(data);
        showMessageServer(res);
    });
}

//--------load locale/remote
function loadGraphLocal(){
    console.log("loadGraphLocal()");
    $("#titleJsonLoad").text("Load local file...");
    $('#inputFile').val("");
    $('#file_content_upload').hide();
    $('#UploadFG').modal('show');
}



function loadGraphRemote(){
    console.log("loadGraphRemote()");
    //download all user's graphs
      $.ajax({
        url: 'graphs_from_repository_request/',
        type: 'GET'

    }).done(function(data){

          $("#selfileDownload").empty();

          var array=new Array();
         var file_list=JSON.parse(data);
          for(var i=0;i<file_list.length;i++){
                var t=new Object();
                t['json_file_fg']=file_list[i]['template'];
                t['file_name_fg']=file_list[i].id;
                t['json_file_pos'] = {}
                t['is_find_pos'] = 'false'
                $("#selfileDownload").append("<option>"+file_list[i].id+" - "+t['json_file_fg']["forwarding-graph"].name+"</option>" );
                array.push(t);
          }
          userGraphsRepository=array;
          
           $("#DownloadClick").attr("onclick","DownloadRemoteFile()");
         $("#titleJsonLoadRemote").text("Load remote file...");

        $('#DownloadFG').modal('show');
        $("#file_content_download").hide();

    }).fail(function(){

        console.log("An error occurred, the files couldn't be sent!");
    });


}

function fillInEP(epType,ep) {
    var $html='';

    $("#nameEP").val("");
    $("#epInfo").empty();

    $("#seltypeEP").val(epType);
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

    if(ep!=undefined){

     for(var t in currentEP["properties"]){
        var selector="#id"+t;
        var s=$(selector).val();
        $(selector).val(ep[epType][t])
    }
    }



}




function onClickDrawEP(epType,ep){


        $('#selectEPItems').empty();


           var $html='<select class="form-control" name="type" id="seltypeEP" onchange="fillInEP(this.value)">';

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



        if(epType!=undefined&&ep!=undefined)
            fillInEP(epType,ep);



        $('#FormEP').modal('show');
        unSetKeysWindowListener();

        if(epType==undefined||ep==undefined)
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