function showModelChangeIDFG(){
    $("#ChangeFGID").modal("show");
    unSetKeysWindowListener();
}

function changeIDFG(){
    var new_id;
    new_id = $("#newIDFG").val();

    fg["forwarding-graph"]["id"] = new_id;
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