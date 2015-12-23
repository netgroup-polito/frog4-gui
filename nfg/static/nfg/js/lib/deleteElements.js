/**
 * Created by Francesco Pellerey and Daniele Bevilacqua on 11/12/2015.
 * This file contains all the functions for deleting all of the graphical objects.
 * As always deleting an object means remove the graphical object and the javascript object associated
 */



function deleteVNF(){
    isModified=true;
    VNF_text_section.select("#text_"+selected_node.id).remove();
    var vnf_int=svg.selectAll("[parent=vnf"+selected_node.id+"]");
    console.log(vnf_int);
    var bs_int,bs_links_start,bs_links_end;
    var links_start,links_end;

    /*
     * in this loop we delete all the dual bs_interface links (i.e. the link that starts when the other link end and vice versa),
     *  that start or finish to that vnf interface or to that dual bs interface
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
     * Now deleting the JS Object
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
     * Now deleting the JS Object
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

    var id_vet=idFR.split("-");

    var dualFR=getDualFR(id_vet[1]);

    if(dualFR!==undefined){
        var dualFRId="fr-"+dualFR.id;
        var dualId_vet=dualFRId.split("-");

        flow_rules = _.filter(flow_rules,function(fr){
            return fr["id"]!==dualId_vet[1] &&   fr["id"]!==id_vet[1];
        });
        lines_section.selectAll("[idfr="+dualFRId+"]").remove();
    }else{
        flow_rules= _.filter(flow_rules,function(fr){
            return fr["id"]!==id_vet[1];
        });
    }
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
    isSplitted=false;
    updateView();
}

function deletePortById(portId,vnfId){
    /*
     1.Deleting graphical object
     */
    var portId_mod=portId.replace(/:/g,"\\:");
    //elimino porta e BS interface
    interfaces_section.selectAll("#"+portId_mod).remove();
    //delete link that start from port and that end to port
    lines_section.selectAll("[start="+portId_mod+"]").remove();
    lines_section.selectAll("[end="+portId_mod+"]").remove();
    //delete link that start from bs port and that end to bs port
    lines_section.selectAll("[start=bs-"+portId_mod+"]").remove();
    lines_section.selectAll("[end=bs-"+portId_mod+"]").remove();

    /*
     2. Now deleting the JS Object
     // */
    //delete port from vnf
    var vnf_js=getVNFById(vnfId);
    vnf_js.ports= _.filter(vnf_js.ports,function(e){
        if(e.fullId===portId)return false;
        return true;
    });
    //delete flow rules that start or end in that port
    flow_rules= _.filter(flow_rules,function(fr){
        var id_port_in=fr["match"]["port_in"],id_port_out= fr["actions"][0]["output"];
        if(id_port_in===undefined || id_port_out===undefined) return true;
        if(id_port_in===portId || id_port_out===portId) return false;
        return true;
    });
}