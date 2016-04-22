function showModelChangeIDFG(){

    $("#newIDFG").val(fg["forwarding-graph"]["id"]);

    if(fg["forwarding-graph"]["name"] === undefined || fg["forwarding-graph"]["name"] === null){
        $("#nameFG").val("");
    }else{
        $("#nameFG").val(fg["forwarding-graph"]["name"]);
    }

    if(fg["forwarding-graph"]["description"] === undefined || fg["forwarding-graph"]["description"] === null){
        $("#descriptionFG").val("");
    }else{
        $("#descriptionFG").val(fg["forwarding-graph"]["description"]);
    }

    $("#ChangeFGID").modal("show");
    unSetKeysWindowListener();
}

function changeIDFG(){
    var new_id;
    new_id = $("#newIDFG").val();
    var new_name = $("#nameFG").val();
    var new_description = $("#descriptionFG").val();

    fg["forwarding-graph"]["id"] = new_id;
    fg["forwarding-graph"]["name"] = new_name;
    fg["forwarding-graph"]["description"] = new_description;

    console.log(fg);

    $("#ChangeFGID").modal("hide");
    setKeysWindowListener();
    drawLabelIdFG();
}

function setIDFG(id){
    isModified=true;
    fg["forwarding-graph"]["id"] = id;
    console.log(id);
    drawLabelIdFG();
}