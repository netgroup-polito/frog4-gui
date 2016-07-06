/* In this file there are all functions to manage 
   the FlowRule form */

function showMatch(){
    if(!$(".match").is(":visible")){
        $("#icon-match").attr("class","glyphicon glyphicon-chevron-down");
    }else{
        $("#icon-match").attr("class","glyphicon glyphicon-chevron-right");
    }   
    $(".match").slideToggle("slow");
    
}

function showAction(){
    if(!$(".action").is(":visible")){
        $("#icon-action").attr("class","glyphicon glyphicon-chevron-down");
    }else{
        $("#icon-action").attr("class","glyphicon glyphicon-chevron-right");
    }
    $(".action").slideToggle("slow");
    
}

function hideMatch(){
	$(".match").hide();
}

function hideAction(){
	$(".action").hide();
}


/* functions to manage the duplicate fields of full duplex links */
function AddDuplicateFields(){
	$(".duplicate").show();
}

function DeleteDuplicateFields(){
	$(".duplicate").hide();
}



function NextIDFlowRule2(){
	var id = NextIdFlowRule();
	id = parseInt(id)+1;
	if(id<10){
		id = "0000000"+id;
	}else{
		id = "000000"+id;
	} 
	return id; 
}


function selOptionLink(){
	$("#selLink").change(function(){
		console.log($("#selLink").val());
		if($("#selLink").val()==="unidirectional link"){
			DeleteDuplicateFields();	
		}else{
			AddDuplicateFields();
			$("#idFlowRule2").val(NextIDFlowRule2());
			$("#idPortIn2").val($("#idOutput").val());
			$("#idOutput2").val($("#idPortIn").val());

		}
	});
}

function resetFormFlowRules(){

    $("#selLink").val("unidirectional link");

	$("#idPriority").val(1);
	$("#idDescription").val("");

    $("#idHardTimeout").val("");
    $("#idEtherType").val("");
    $("#idVlanID").val("");
    $("#idVlanPriority").val("");
    $("#idSourceMac").val("");
    $("#idDestinationMac").val("");
    $("#idSourceIP").val("");
   	$("#idDestinationIP").val("");
    $("#idTosBits").val("");
    $("#idSourcePort").val("");
    $("#idDestinationPort").val("");
    $("#idProtocol").val("");
    
    $("#idSetVlanId").val("");
    $("#idSetVlanPriorityId").val("");
    $("#idPopVlan").val("");
    $("#idSetEthernetSrcAddress").val("");
    $("#idSetEthernetDstAddress").val("");
    $("#idSetIpSrcAddress").val("");
    $("#idSetIpDstAddress").val("");
    $("#idSetIpTos").val("");
    $("#idSetL4SrcPort").val("");
    $("#idSetL4DstPort").val("");
    $("#idOutputToQueue").val("");





    $("#idPriority2").val(1);
	$("#idDescription2").val("");

    $("#idHardTimeout2").val("");
    $("#idEtherType2").val("");
    $("#idVlanID2").val("");
    $("#idVlanPriority2").val("");
    $("#idSourceMac2").val("");
    $("#idDestinationMac2").val("");
    $("#idSourceIP2").val("");
   	$("#idDestinationIP2").val("");
    $("#idTosBits2").val("");
    $("#idSourcePort2").val("");
    $("#idDestinationPort2").val("");
    $("#idProtocol2").val("");
        
    $("#idSetVlanId2").val("");
    $("#idSetVlanPriorityId2").val("");
    $("#idPopVlan2").val("");
    $("#idSetEthernetSrcAddress2").val("");
    $("#idSetEthernetDstAddress2").val("");
    $("#idSetIpSrcAddress2").val("");
    $("#idSetIpDstAddress2").val("");
    $("#idSetIpTos2").val("");
    $("#idSetL4SrcPort2").val("");
    $("#idSetL4DstPort2").val("");
    $("#idOutputToQueue2").val("");

}

/* This function fills the fields of flowrules */ 

function fillFlowRule(flow_rule){
    $("#idPriority").val(flow_rule.priority);
    $("#idDescription").val(flow_rule.description);

    $("#idFlowRule").val(flow_rule.id);

    $("#idhard_timeout").val(flow_rule.match.hard_timeout);
    $("#idether_type").val(flow_rule.match.ether_type);
    $("#idvlan_id").val(flow_rule.match.vlan_id);
    $("#idvlan_priority").val(flow_rule.match.vlan_priority);
    $("#idsource_mac").val(flow_rule.match.source_mac);
    $("#iddest_mac").val(flow_rule.match.dest_mac);
    $("#idsource_ip").val(flow_rule.match.source_ip);
    $("#iddest_ip").val(flow_rule.match.dest_ip);
    $("#idtos_bits").val(flow_rule.match.tos_bits);
    $("#idvlan_id").val(flow_rule.match.vlan_id);
    $("#iddest_port").val(flow_rule.match.dest_port);
    $("#idprotocol").val(flow_rule.match.protocol);

    $("#idport_in").val(flow_rule.match.port_in);
    
    $("#set_vlan_id").val(flow_rule.actions[0].set_vlan_id);
    //TODO aggiustare set_vlan_priority-id
    $("#idSetVlanPriorityId").val(flow_rule.actions[0]["set_vlan_priority-id"]);
    $("#idpop_vlan").val(flow_rule.actions[0].pop_vlan);
    $("#idset_ethernet_src_address").val(flow_rule.actions[0].set_ethernet_src_address);
    $("#idset_ethernet_dst_address").val(flow_rule.actions[0].set_ethernet_dst_address);
    $("#idset_ip_src_address").val(flow_rule.actions[0].set_ip_src_address);
    $("#idset_ip_dst_address").val(flow_rule.actions[0].set_ip_dst_address);
    $("#idset_ip_tos").val(flow_rule.actions[0].set_ip_tos);
    $("#idset_l4_src_port").val(flow_rule.actions[0].set_l4_src_port);
    $("#idset_l4_dst_port").val(flow_rule.actions[0].set_l4_dst_port);
    $("#idoutput_to_queue").val(flow_rule.actions[0].output_to_queue);

    var t=flow_rule.actions[0].output;

    $("#idoutput_to_port").val(flow_rule.actions[0].output);


}

function showEditInfoFlowRule(id_flow){

    if(!BS_view){
        hideComplexFRFields();
    }else{
        showComplexFRFields();
    }
    
    console.log(id_flow);
    var flow_rule = {};
    flow_rule = getFlowRulesById(id_flow);
    console.log("qua");
    console.log(flow_rule);
    fillFlowRule(flow_rule);

    $(".duplicate").hide();
    $("#ModalFlowRules").modal("show");
    unSetKeysWindowListener();
    $("#selLink").val("unidirectional link");
    $("#selLink").attr("disabled","disabled");

    $("#saveRule").attr('onclick','editLink(\''+id_flow+'\')');
    $("#saveRule").html("Edit Rule");
    


}


function hideComplexFRFields(){
    $("#idPriority").hide();
    $(".complexFRFields").hide();
}

function showComplexFRFields(){
    $("#idPriority").show();
    $(".complexFRFields").show();
}

function editLink(id_flow){

     var flow_rule = getFlowRulesById(id_flow);
    console.log(flow_rule);

    var match={};
    var actions=[];
    var action={};
    
    flow_rule["priority"] = parseInt($("#idPriority").val());
    flow_rule["description"] = $("#idDescription").val();
    


    match["hard_timeout"] = $("#idhard_timeout").val();
    match["ether_type"] = $("#idether_type").val();
    match["vlan_id"] = $("#idvlan_id").val();
    match["vlan_priority"] = $("#idvlan_priority").val();
    match["source_mac"] = $("#idsource_mac").val();
    match["dest_mac"] = $("#iddest_mac").val();
    match["source_ip"] = $("#idsource_ip").val();
    match["dest_ip"] = $("#iddest_ip").val();
    match["tos_bits"] = $("#idtos_bits").val();
    match["source_port"] = $("#idsource_port").val();
    match["dest_port"] = $("#iddest_port").val();
    match["protocol"] = $("#idprotocol").val();
    match["port_in"] = flow_rule.match["port_in"];
    
    flow_rule["match"] = match;
    
    action["output"] = flow_rule.actions[0]["output"];
    action["set_vlan_id"] = $("#idset_vlan_id").val();
    action["set_vlan_priority-id"] = $("#idset_vlan_priority-id").val();
    action["pop_vlan"] = $("#idpop_vlan").val();
    action["set_ethernet_src_address"] = $("#idset_ethernet_src_address").val();
    action["set_ethernet_dst_address"] = $("#idset_ethernet_dst_address").val();
    action["set_ip_src_address"] = $("#idset_ip_src_address").val();
    action["set_ip_dst_address"] = $("#idset_ip_dst_address").val();
    action["set_ip_tos"] = $("#idset_ip_tos").val();
    action["set_l4_src_port"] = $("#idset_l4_src_port").val();
    action["set_l4_dst_port"] = $("#idset_l4_dst_port").val();
    action["output_to_queue"] = $("#idoutput_to_queue").val();

    actions.push(action);
    flow_rule["actions"] = actions;

    console.log("flow rule appena creata");
    console.log(flow_rule);

    $("#ModalFlowRules").modal("hide");
    setKeysWindowListener();
    $("#saveRule").attr('onclick','DrawNewLink()');
    $("#saveRule").html("Add Rule");
    drawBigSwitchInfo();

}

