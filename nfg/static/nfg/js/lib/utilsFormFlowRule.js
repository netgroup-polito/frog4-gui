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


