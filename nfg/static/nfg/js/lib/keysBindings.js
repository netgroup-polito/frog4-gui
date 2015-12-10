/**
 * Created by pc asus on 01/12/2015.
 */

function keyUp(){

    lastKeyDown=-1;
}

function keyDown(){
    //d3.event.preventDefault();
    console.log("ciao");
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
                console.log(selected_node);

                /*
                 * QUA INSERIRE IL MESSAGGIO DI CONFERMA!
                 *
                 * AGGIUNGERE ELIMINAZIONE DA JS
                 */
                if($(selected_node).attr("class")==="NetworkFunction"){
                    console.log("è una vnf");
                    var vnf_int=svg.selectAll("[parent=vnf"+selected_node.id+"]");
                    console.log(vnf_int);
                    var bs_int,bs_links_start,bs_links_end;
                    var links_start,links_end;
                    //var vnf_js=getVNFById(selected_node.id);

                    vnf_int[0].forEach(function(int){
                        var id=int.id.replace(/:/g,"\\:");
                        bs_int=svg.select(".BS_interface#"+id);
                        links_start=svg.selectAll("[start="+id+"]");
                        links_end=svg.selectAll("[end="+id+"]");
                        bs_links_start=svg.selectAll("[start=bs-"+id+"]");
                        bs_links_end=svg.selectAll("[end=bs-"+id+"]");
                        bs_links_start.remove();
                        bs_links_end.remove();
                        links_end.remove();
                        links_start.remove();
                        bs_int.remove();
                    });
                    vnf_int.remove();
                    $(selected_node).remove();
                    /*
                     * ELIMINARLI DAGLI OGGETTI JS!!!!
                     */
                    flow_rules= _.filter(flow_rules,function(fr){
                        var id_port_in=fr["match"]["port_in"],id_port_out= fr["actions"][0]["output"];
                        if(id_port_in===undefined || id_port_out===undefined) return true;
                        var id_port_in_split=[],id_port_out_split=[];
                        id_port_in_split=id_port_in.split(":");
                        id_port_out_split=id_port_out.split(":");
                        if(id_port_in_split[0]==="vnf" && id_port_in_split[1]===selected_node.id) return false;
                        if(id_port_out_split[0]==="vnf" && id_port_out_split[1]===selected_node.id) return false;
                        return true;
                    });
                    NF_list= _.filter(NF_list,function(e){return e.id!==selected_node.id;});


                }else{ //ep

                    d3.selectAll("[start=endpoint\\:"+selected_node.id).remove();
                    d3.selectAll("[end=endpoint\\:"+selected_node.id).remove();
                    d3.selectAll(".BS_interface#endpoint\\:"+selected_node.id).remove();
                    d3.selectAll("[start=bs-endpoint\\:"+selected_node.id).remove();
                    d3.selectAll("[end=bs-endpoint\\:"+selected_node.id).remove();
                    $(selected_node).remove();
                    /*
                     * ELIMINARLI DAGLI OGGETTI JS!!!!
                     */
                    flow_rules= _.filter(flow_rules,function(fr){
                        var id_port_in=fr["match"]["port_in"],id_port_out= fr["actions"][0]["output"];
                        if(id_port_in===undefined || id_port_out===undefined) return true;
                        var id_port_in_split=[],id_port_out_split=[];
                        id_port_in_split=id_port_in.split(":");
                        id_port_out_split=id_port_out.split(":");
                        if(id_port_in_split[0]==="endpoint" && id_port_in_split[1]===selected_node.id) return false;
                        if(id_port_out_split[0]==="endpoint" && id_port_out_split[1]===selected_node.id) return false;
                        return true;
                    });
                    EP_list= _.filter(EP_list,function(e){return e.id!==selected_node.id;});
                }

            } else if(selected_link) {
                //links.splice(links.indexOf(selected_link), 1);
                console.log("cancello");

                /*
                 * QUA INSERIRE IL MESSAGGIO DI CONFERMA!
                 *
                 * AGGIUNGERE ELIMINAZIONE DA JS
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