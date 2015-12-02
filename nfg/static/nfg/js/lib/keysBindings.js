/**
 * Created by pc asus on 01/12/2015.
 */

function keyUp(){

    lastKeyDown=-1;
}

function keyDown(){
    d3.event.preventDefault();

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
            console.log("ho premuto canc");
            if(selected_node) {
                console.log("cancello");

                /*
                 * QUA INSERIRE IL MESSAGGIO DI CONFERMA!
                 */
                d3.select(selected_node).remove();
            } else if(selected_link) {
                //links.splice(links.indexOf(selected_link), 1);
                console.log("cancello");

                /*
                 * QUA INSERIRE IL MESSAGGIO DI CONFERMA!
                 */
                d3.select(selected_link).remove();
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