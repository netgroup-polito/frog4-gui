function drawFormEP(){
    var opt = "";

            $(function(){
                $("#boxInterface").hide();
                $("#boxGre").hide();
                $("#boxVlan").hide();
                $("#titleInterface").hide();
           
                $("#seltypeEP").change(function(){
                    var opt_sel = $( "#seltypeEP" ).val();
                                      
                        switch(opt_sel){

                            case "internal":
                                viewInputIternal();
                                break;

                            case "interface":
                                viewInputInterface();
                                break;

                            case "interface-out":
                                viewInputInterface();
                                break;

                            case "gre-tunnel":
                                viewInputGre();
                                break;

                            case "vlan":
                                viewInputVlan();
                                break;
                        }
                        opt = opt_sel;
                        console.log($( "#seltypeEP" ).val());                    
                })
            })            
}



function showEditInfoEP(idEP){
    unSetKeysWindowListener();
    $('#FormEP').modal('show');
    fillFormInfoEP(idEP);
}

/*function changeTitleEP(idEP,name){
    console.log("quuuuu");
    console.log(name);
    $("#"+idEP).attr("title",name);
    updateTooltips();

}*/


function fillFormInfoEP(idEP){
    var ep;
    /*EP_list.forEach(function(ele){
        if(parseInt(ele.id) == idEP){
            ep = ele;
            return;
        }
    });*/
    ep = getEndPointById(idEP);

    $("#nameEP").val(ep["name"]);
    $("#seltypeEP").val(ep["type"]);
    $("#remoteEPid").val(ep["remote_endpoint_id"]);
    $("#idEndPoint").val(ep["id"]);

    switch(ep["type"]){
        case "internal":
            viewInputIternal();
            break;

        case "interface":
            $("#node").val(ep["interface"]["node"]);
            $("#switch-id").val(ep["interface"]["switch-id"]);
            $("#interface").val(ep["interface"]["interface"]);
            viewInputInterface();
            break;

        case "interface-out":
            $("#node").val(ep["interface-out"]["node"]);
            $("#switch").val(ep["interface-out"]["switch-id"]);
            $("#interface").val(ep["interface-out"]["interface"]);
            viewInputInterface();
            break;

        case "gre-tunnel":

            $("#localIP").val(ep["gre-tunnel"]["local-ip"]);
            $("#remoteIP").val(ep["gre-tunnel"]["remote-ip"]);
            $("#greInterface").val(ep["gre-tunnel"]["interface"]);
            $("#ttl").val(ep["gre-tunnel"]["ttl"]);
            viewInputGre();
            break;

        case "vlan":

            $("#vlanID").val(ep["vlan"]["vlan-id"]);
            $("#vlanInterface").val(ep["vlan"]["interface"]);
            $("#switch").val(ep["vlan"]["switch-id"]);
            $("#vlanNode").val(ep["vlan"]["node"]);
            viewInputVlan();
            break;
    }

    console.log("qua");
    //changeTitleEP(idEP,$("#nameEP").val());

    $("#saveEP").attr("onclick","saveNewEp()");
    $("#saveEP").html("Save End Point");


    console.log(ep);

}

function viewInputIternal(){
    $("#boxVlan").hide();
    $("#boxGre").hide();
    $("#boxInterface").hide();
    $("#titleInterface").hide();
}

function viewInputInterface(){
    $("#boxVlan").hide();
    $("#boxGre").hide();
    $("#boxInterface").show();
    $("#titleInterface").show().html("Interface");
}

function viewInputGre(){
    $("#boxVlan").hide();
    $("#boxGre").show();
    $("#boxInterface").hide();
    $("#titleInterface").show().html("Gre-tunnel");
}

function viewInputVlan(){
    $("#boxVlan").show();
    $("#boxGre").hide();
    $("#boxInterface").hide();
    $("#titleInterface").show().html("Vlan");
}


function resetFormEp(){
    $("#titleInterface").hide();
    $('#boxInterface').hide();
    $('#boxGre').hide();
    $('#boxVlan').hide();


    /* Reset Input Form */
    $("#nameEP").val("");
    $("#remoteEPid").val("");
    /*interface*/
    resetInputsInterface();
    /*gre*/
    resetInputsGree();
    /*vlan*/
    resetInputsVlan();
    /* Reset Validazione */
    resetValidation();
}

function resetInputsInterface(){
    $("#interface").val("");
    $("#remoteIP").val("");
    $("#node").val("");
    $("#switch").val("");
}

function resetInputsGree(){
    $("#localIP").val("");
    $("#remoteIP").val("");
    $("#greInterface").val("");
    $("#ttl").val("");
}

function resetInputsVlan(){
    $("#vlanID").val("");
    $("#vlanSwitch").val("");
    $("#vlanInterface").val("");
    $("#vlanNode").val("");
}

function resetValidation(){
    $("#interface").parent().parent().attr("class","form-group");
    $("#localIP").parent().parent().attr("class","form-group");
    $("#remoteIP").parent().parent().attr("class","form-group");
    $("#greInterface").parent().parent().attr("class","form-group");
    $("#vlanID").parent().parent().attr("class","form-group");
    $("#vlanInterface").parent().parent().attr("class","form-group");
}




