function drawFormEP(){
    opt = "";

            $(function(){
                $("#boxInterface").hide();
                $("#boxGre").hide();
                $("#boxVlan").hide();
                $("#titleInterface").hide();
           
                $("#seltypeEP").change(function(){
                    opt_sel = $( "#seltypeEP" ).val();
                                      
                        switch(opt_sel){

                            case "internal":
                                $("#boxVlan").hide();
                                $("#boxGre").hide();
                                $("#boxInterface").hide();
                                $("#titleInterface").hide();
                                break;

                            case "interface":
                                $("#boxVlan").hide();
                                $("#boxGre").hide();
                                $("#boxInterface").show();
                                $("#titleInterface").show().html("Interface");
                                break;

                            case "interface-out":
                                $("#boxVlan").hide();
                                $("#boxGre").hide();
                                $("#boxInterface").show();
                                $("#titleInterface").show().html("Interface-out");
                                break;

                            case "gre-tunnel":
                                $("#boxVlan").hide();
                                $("#boxInterface").hide();
                                $("#boxGre").show();
                                $("#titleInterface").show().html("Gre-tunnel");
                                break;

                            case "vlan":
                                $("#boxGre").hide();
                                $("#boxInterface").hide();
                                $("#boxVlan").show();
                                $("#titleInterface").show().html("Vlan");
                                break;
                        }
                        opt = opt_sel;
                        console.log($( "#seltypeEP" ).val());                    
                })
            })            
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
