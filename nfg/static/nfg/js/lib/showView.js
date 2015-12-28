/**
 * This file contains the functions for manage the view of the graph.
 *
 * There are 2 different view: BS_view (with Big Switch in the center) and simple_view.
 *
 */
function showBSView(bs_view){

    var debug=false;
    if(!debug) {
        if (bs_view === false && isSplitted === true) {
            $('#BSViewToogle').attr("class", "menu btn btn-warning btn-lg");
            $('#ModalWarning').modal('show');
        } else if (isSplitted === false && bs_view === true) {
            $('#BSViewToogle').attr("class", "btn btn-info btn-lg");
        }
        if (bs_view === false && isSplitted === false) {
            BS_view = false;
            $('#BSViewToogle').attr("class", "menu btn btn-default btn-lg");
            $(".use_BIG,.BS_interface,.BS_line,.BS-line,.BS-line-selected").hide();
            $(".line,.line-selected").show();
            //$(".info").empty();
            
        } else {
            BS_view = true;
            $(".use_BIG,.BS_interface,.BS_line,.BS-line,.BS-line-selected").show();
            $(".line,.line-selected").hide();
        }
    }
}

function updateView(){
    if(isSplitted){
        $('#BSViewToogle').attr("class","menu btn btn-warning btn-lg");
        showBSView(true);
    }else {
        showBSView(BS_view);
    }
}

function switchView(){
    //if(isSplitted){
    //    $('#BSViewToogle').prop('disabled', true);
   
    console.log("bho");
    console.log("isSplitted: "+isSplitted);
    console.log("siamo in view BS_view: "+BS_view);
    showBSView(!BS_view);

}