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
		if($("#selLink").val()==="single-link"){
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

    $("#selLink").val("single-link");

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

function fillFlowRule(flow_rule){
    $("#idPriority").val(flow_rule.priority);
    $("#idDescription").val(flow_rule.description);

    $("#idFlowRule").val(flow_rule.id);

    $("#idHardTimeout").val(flow_rule.match.hard_timeout);
    $("#idEtherType").val(flow_rule.match.ether_type);
    $("#idVlanID").val(flow_rule.match.vlan_id);
    $("#idVlanPriority").val(flow_rule.match.vlan_priority);
    $("#idSourceMac").val(flow_rule.match.source_mac);
    $("#idDestinationMac").val(flow_rule.match.dest_mac);
    $("#idSourceIP").val(flow_rule.match.source_ip);
    $("#idDestinationIP").val(flow_rule.match.dest_ip);
    $("#idTosBits").val(flow_rule.match.tos_bits);
    $("#idSourcePort").val(flow_rule.match.vlan_id);
    $("#idDestinationPort").val(flow_rule.match.dest_port);
    $("#idProtocol").val(flow_rule.match.protocol);

    $("#idPortIn").val(flow_rule.match.port_in);
    
    $("#idSetVlanId").val(flow_rule.actions[0].set_vlan_id);
    $("#idSetVlanPriorityId").val(flow_rule.actions[0]["set_vlan_priority-id"]);
    $("#idPopVlan").val(flow_rule.actions[0].pop_vlan);
    $("#idSetEthernetSrcAddress").val(flow_rule.actions[0].set_ethernet_src_address);
    $("#idSetEthernetDstAddress").val(flow_rule.actions[0].set_ethernet_dst_address);
    $("#idSetIpSrcAddress").val(flow_rule.actions[0].set_ip_src_address);
    $("#idSetIpDstAddress").val(flow_rule.actions[0].set_ip_dst_address);
    $("#idSetIpTos").val(flow_rule.actions[0].set_ip_tos);
    $("#idSetL4SrcPort").val(flow_rule.actions[0].set_l4_src_port);
    $("#idSetL4DstPort").val(flow_rule.actions[0].set_l4_dst_port);
    $("#idOutputToQueue").val(flow_rule.actions[0].output_to_queue);

    $("#idOutput").val(flow_rule.actions[0].output);


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
    $("#selLink").val("single-link");
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

    flow_rule = getFlowRulesById(id_flow);
    console.log(flow_rule);

    var match={};
    var actions=[];
    var action={};
    
    flow_rule["priority"] = $("#idPriority").val();
    flow_rule["description"] = $("#idDescription").val();
    


    match["hard_timeout"] = $("#idHardTimeout").val();
    match["ether_type"] = $("#idEtherType").val();
    match["vlan_id"] = $("#idVlanID").val();
    match["vlan_priority"] = $("#idVlanPriority").val();
    match["source_mac"] = $("#idSourceMac").val();
    match["dest_mac"] = $("#idDestinationMac").val();
    match["source_ip"] = $("#idSourceIP").val();
    match["dest_ip"] = $("#idDestinationIP").val();
    match["tos_bits"] = $("#idTosBits").val();
    match["source_port"] = $("#idSourcePort").val();
    match["dest_port"] = $("#idDestinationPort").val();
    match["protocol"] = $("#idProtocol").val();
    match["port_in"] = flow_rule.match["port_in"];
    
    flow_rule["match"] = match;
    
    action["output"] = flow_rule.actions[0]["output"];
    action["set_vlan_id"] = $("#idSetVlanId").val();
    action["set_vlan_priority-id"] = $("#idSetVlanPriorityId").val();
    action["pop_vlan"] = $("#idPopVlan").val();
    action["set_ethernet_src_address"] = $("#idSetEthernetSrcAddress").val();
    action["set_ethernet_dst_address"] = $("#idSetEthernetDstAddress").val();
    action["set_ip_src_address"] = $("#idSetIpSrcAddress").val();
    action["set_ip_dst_address"] = $("#idSetIpDstAddress").val();
    action["set_ip_tos"] = $("#idSetIpTos").val();
    action["set_l4_src_port"] = $("#idSetL4SrcPort").val();
    action["set_l4_dst_port"] = $("#idSetL4DstPort").val();
    action["output_to_queue"] = $("#idOutputToQueue").val();

    actions.push(action);
    flow_rule["actions"] = actions;

    console.log("flow rule appena creata");
    console.log(flow_rule);

    $("#ModalFlowRules").modal("hide");
    setKeysWindowListener();
    $("#saveRule").attr('onclick','DrawNewLink()');
    $("#saveRule").html("Add Rule");

}

