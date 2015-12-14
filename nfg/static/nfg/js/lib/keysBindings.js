/**
 * Created by pc asus on 01/12/2015.
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
                 * QUA INSERIRE IL MESSAGGIO DI CONFERMA!
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
            selected_link = null;
            selected_node = null;
            break;
        case 68:
            if(selected_node) {
                /*
                 * QUA INSERIRE IL MESSAGGIO DI CONFERMA!
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
            selected_link = null;
            selected_node = null;
            break;
        case 66: // B
            //if(selected_link) {
            //    // set link direction to both left and right
            //    selected_link.left = true;
            //    selected_link.right = true;
            //}
            break;
        case 76: // L
            //if(selected_link) {
            //    // set link direction to left only
            //    selected_link.left = true;
            //    selected_link.right = false;
            //}
            //restart();
            break;
        case 82: // R
            //if(selected_node) {
            //    // toggle node reflexivity
            //    selected_node.reflexive = !selected_node.reflexive;
            //} else if(selected_link) {
            //    // set link direction to right only
            //    selected_link.left = false;
            //    selected_link.right = true;
            //}
            //restart();
            break;
    }
}