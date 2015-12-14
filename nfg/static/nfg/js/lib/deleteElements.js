/**
 * Created by pc asus on 11/12/2015.
 */



function deleteVNF(){
    isModified=true;
    VNF_text_section.select("#text_"+selected_node.id).remove();
    var vnf_int=svg.selectAll("[parent=vnf"+selected_node.id+"]");
    console.log(vnf_int);
    var bs_int,bs_links_start,bs_links_end;
    var links_start,links_end;

    /*
     * in this loop we delete all the dual bs_interface, links that start and finish to that vnf interface or to that dual bs interface
     */
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
    big_switch.interfaces= _.filter(big_switch.interfaces,function(e){return e.id!==select_node.fullId});
}
function deleteEP(){
    isModified=true;
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
function deleteFR(){
    isModified=true;
    console.log(selected_link);
    var idFR=selected_link.getAttribute("idfr");
    console.log(idFR);
    var id_vet=idFR.split("-");
    if(idFR===undefined)
        return;
    flow_rules= _.filter(flow_rules,function(fr){
        return fr["id"]!==id_vet[1];
    });
    //se era double settare la rimanente a non double con la freccia

    /*
     * QUA INSERIRE IL MESSAGGIO DI CONFERMA!
     *
     */
    lines_section.selectAll("[idfr="+idFR+"]").remove();
}

function eraseAll(){
    $("#SaveFG").modal("hide");
    //ajaxLastIdRequest();
    flow_rules=[];
    big_switch.interfaces=[];
    NF_list=[];
    EP_list=[];
    $(".lines_section").empty();
    $(".VNF_section").empty();
    $(".interfaces_section").empty();
    $(".VNF_text_section").empty();
}