function showMatch(){
    $(".match").slideToggle("slow");
}

function showAction(){
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


}

function showEditInfoFlowRule(id_flow){
    console.log(id_flow);
    var flow_rule = {};
    flow_rule = getFlowRulesById(id_flow);
    console.log(flow_rule);
    fillFlowRule(flow_rule);

    console.log(flow_rule);

    $("#ModalFlowRules").modal("show");
    $(".duplicate").modal("hide");


}


function hideComplexFRFields(){
    $("#idPriority").hide();


    //$("#idHardTimeout").hide();
    //$("#idEtherType").hide();
    //$("#idVlanID").hide();
    //$("#idVlanPriority").hide();
    //$("#idSourceMac").hide();
    //$("#idDestinationMac").hide();
    //$("#idSourceIP").hide();
    //$("#idDestinationIP").hide();
    //$("#idTosBits").hide();
    //$("#idSourcePort").hide();
    //$("#idDestinationPort").hide();
    //$("#idProtocol").hide();
    //
    //$("#idSetVlanId").hide();
    //$("#idSetVlanPriorityId").hide();
    //$("#idPopVlan").hide();
    //$("#idSetEthernetSrcAddress").hide();
    //$("#idSetEthernetDstAddress").hide();
    //$("#idSetIpSrcAddress").hide();
    //$("#idSetIpDstAddress").hide();
    //$("#idSetIpTos").hide();
    //$("#idSetL4SrcPort").hide();
    //$("#idSetL4DstPort").hide();
    //$("#idOutputToQueue").hide();
    $(".complexFRFields").hide();
}