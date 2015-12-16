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

