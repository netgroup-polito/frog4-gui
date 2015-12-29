function showModelChangeIDFG(){

    $("#newIDFG").val(fg["forwarding-graph"]["id"]);

    if(fg["forwarding-graph"]["name"] === undefined || fg["forwarding-graph"]["name"] === null){
        $("#nameFG").val("");
    }else{
        $("#nameFG").val(fg["forwarding-graph"]["name"]);
    }

    if(fg["forwarding-graph"]["descriptionFG"] === undefined || fg["forwarding-graph"]["descriptionFG"] === null){
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
    new_name = $("#nameFG").val();
    new_description = $("#descriptionFG").val();

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