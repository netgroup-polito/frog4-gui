/**
 *  This file contains the functions for manage the key pressed behaviour.
 *  For now only delete, "d"  and "esc" button are managed.
 *
 *  Put here your implementation for manage some other keys button.
 */

function keyUp(){
    drawBigSwitchInfo(fg);
    disableTooltip();
    lastKeyDown=-1;
}

function keyDown(){
    //d3.event.preventDefault();
    if(lastKeyDown !== -1) return;
    lastKeyDown = d3.event.keyCode;

    // ctrl
    if(d3.event.keyCode === 27) {
        deleteTempLink();
        console.log("ho premuto esc!;");
    }
    if(!selected_node && !selected_link) return;
    switch(d3.event.keyCode) {
        case 8: // backspace
        case 46: // delete
            if(selected_node) {
                /*
                 * Confirmation Message maybe needed?
                 *
                 */
                if($(selected_node).attr("class")==="NetworkFunction"){
                    deleteVNF();
                }else{ //ep
                    deleteEP();
                }

            } else if(selected_link) {
                deleteFR();
            }
            checkSplit();
            updateView();
            selected_link = null;
            selected_node = null;
            break;
        case 68:
            if(selected_node) {
                /*
                 * Confirmation Message maybe needed?
                 *
                 */
                if($(selected_node).attr("class")==="NetworkFunction"){
                    deleteVNF();
                }else{ //ep
                    deleteEP();
                }

            } else if(selected_link) {
                deleteFR();
            }
            checkSplit();
            updateView();
            selected_link = null;
            selected_node = null;
            break;
        case 66: // B
            break;
        case 76: // L
            break;
        case 82: // R
            break;
    }
}