/* In this file there are all functions to manage 
   the serialation of graphic object in json object 
	
   In particular there are two functions:

   	- serializer_fg() 	--> It serializes a forwarding-graph 
   	- serializer_pos() 	--> It serializes the position of a forwarding-graph
*/



function serialize_fg(){
	var file_fg = {};
	
	file_fg["forwarding-graph"] = ser_fg();
	
	console.log(file_fg);
	console.log(JSON.stringify(file_fg))

	return JSON.stringify(file_fg);

}

/* function to serialize big switch object */

function ser_big(){

	var big_switch = {};
	big_switch["flow-rules"]=[];

	flow_rules.forEach(function(ele){
		var flowrule = {};
		flowrule["id"] = ele["id"];
		flowrule["priority"] = ele["priority"];
		if(ele["description"] != undefined && ele["description"] != "")
			flowrule["description"] = ele["description"];
		flowrule["match"] = {};

		var match = {};

		if(ele["match"]["hard_timeout"] != undefined &&  ele["match"]["hard_timeout"] != "")
			match["hard_timeout"]   = ele["match"]["hard_timeout"];

		if(ele["match"]["ether_type"] != undefined && ele["match"]["ether_type"] != "")
			match["ether_type"]		= ele["match"]["ether_type"];

		if(ele["match"]["vlan_id"] != undefined && ele["match"]["vlan_id"] != "")
			match["vlan_id"]		= ele["match"]["vlan_id"];

		if(ele["match"]["vlan_priority"] != undefined && ele["match"]["vlan_priority"] != "")
			match["vlan_priority"]	= ele["match"]["vlan_priority"];

		if(ele["match"]["source_mac"] != undefined && ele["match"]["source_mac"] != "")
			match["source_mac"]		= ele["match"]["source_mac"];

		if(ele["match"]["dest_mac"] != undefined && ele["match"]["dest_mac"] != "")
			match["dest_mac"]		= ele["match"]["dest_mac"];

		if(ele["match"]["source_ip"] != undefined && ele["match"]["source_ip"] != "")
			match["source_ip"]		= ele["match"]["source_ip"];

		if(ele["match"]["dest_ip"] != undefined && ele["match"]["dest_ip"] != "")
			match["dest_ip"]		= ele["match"]["dest_ip"];

		if(ele["match"]["tos_bits"] != undefined && ele["match"]["tos_bits"] != "")
			match["tos_bits"]		= ele["match"]["tos_bits"];

		if(ele["match"]["source_port"] != undefined && ele["match"]["source_port"] != "")
			match["source_port"]	= ele["match"]["source_port"];

		if(ele["match"]["dest_port"] != undefined && ele["match"]["dest_port"] != "")
			match["dest_port"]		= ele["match"]["dest_port"];

		if(ele["match"]["protocol"] != undefined && ele["match"]["protocol"] != "")
			match["protocol"]		= ele["match"]["protocol"];

		match["port_in"]		= ele["match"]["port_in"];
		
		flowrule["match"]= match;


										 		

		var actions = [];

		ele_action = ele["actions"];

		ele_action.forEach(function(ele2){
			var action = {};
			action["output"] = ele2["output"];

			if(ele2["set_vlan_id"] != undefined && ele2["set_vlan_id"] != "")
				action["set_vlan_id"] = ele2["set_vlan_id"];

			if(ele2["set_vlan_priority-id"] != undefined && ele2["set_vlan_priority-id"] != "")
				action["set_vlan_priority-id"] = ele2["set_vlan_priority-id"];

			if(ele2["pop_vlan"] != undefined && ele2["pop_vlan"] != "")
				action["pop_vlan"] = ele2["pop_vlan"];

			if(ele2["set_ethernet_src_address"] != undefined && ele2["set_ethernet_src_address"] != "")
				action["set_ethernet_src_address"] = ele2["set_ethernet_src_address"];

			if(ele2["set_ethernet_dst_address"] != undefined && ele2["set_ethernet_dst_address"] != "")
				action["set_ethernet_dst_address"] = ele2["set_ethernet_dst_address"];

			if(ele2["set_ip_src_address"] != undefined && ele2["set_ip_src_address"] != "")
				action["set_ip_src_address"] = ele2["set_ip_src_address"];

			if(ele2["set_ip_dst_address"] != undefined && ele2["set_ip_dst_address"] != "")
				action["set_ip_dst_address"] = ele2["set_ip_dst_address"];

			if(ele2["set_ip_tos"] != undefined && ele2["set_ip_tos"] != "")
				action["set_ip_tos"] = ele2["set_ip_tos"];

			if(ele2["set_l4_src_port"] != undefined && ele2["set_l4_src_port"] != "")
				action["set_l4_src_port"] = ele2["set_l4_src_port"];

			if(ele2["set_l4_dst_port"] != undefined && ele2["set_l4_dst_port"] != "")
				action["set_l4_dst_port"] = ele2["set_l4_dst_port"];

			if(ele2["output_to_queue"] != undefined && ele2["output_to_queue"] != "")
				action["output_to_queue"] = ele2["output_to_queue"];

			actions.push(action);

		});

		flowrule["actions"] = actions;
		big_switch["flow-rules"].push(flowrule);
	});

	return big_switch;
}

function ser_fg(){
	var forwarding_graph = {};
	

	forwarding_graph["id"] = fg["forwarding-graph"]["id"];
	forwarding_graph["name"] = fg["forwarding-graph"]["name"];
	if( fg["forwarding-graph"]["description"] != undefined &&  fg["forwarding-graph"]["description"] != "")
		forwarding_graph["description"] = fg["forwarding-graph"]["description"];
	//console.log(fg["forwarding-graph"]["description"]);

	forwarding_graph["VNFs"]=[];

	NF_list.forEach(function(ele){
		var vnf = {};
		vnf["id"]	=ele["id"];
		if(ele["name"] != undefined && ele["name"] != "")
			vnf["name"]	=ele["name"];
		vnf["vnf_template"]=ele["vnf_template"];
		vnf["ports"]=[];

		ele.ports.forEach(function(ele2){
			var port = {};
			port["id"]	=ele2.id;
			if(ele2.name != undefined && ele2.name != "")
				port["name"]=ele2.name;
			vnf["ports"].push(port);
		});
		forwarding_graph["VNFs"].push(vnf);
	});

	forwarding_graph["end-points"]=[];

	EP_list.forEach(function(ele){
		var ep = {};
		ep["id"] = ele["id"];
		if(ele["name"] != undefined && ele["name"] != "")
			ep["name"] = ele["name"];
		if(ele["type"] != undefined && ele["type"] != "")
			ep["type"] = ele["type"];
		if(ele["remote_endpoint_id"] != undefined && ele["remote_endpoint_id"] != "")
			ep["remote_endpoint_id"] = ele["remote_endpoint_id"];
		//ep["prepare_connection_to_remote_endpoint_ids"] = ele["prepare_connection_to_remote_endpoint_ids"];
		

		/* controllo sul tipo di end point */
		if(ele["type"] != undefined && ele["type"] != "") {
			switch (ep["type"]) {
				case "internal":
					ep["internal"] = {};
					break;
				case "interface":
					ep["interface"] = {};
					ep["interface"]["node-id"] = ele["interface"]["node-id"];
					ep["interface"]["switch-id"] = ele["interface"]["switch-id"];
					ep["interface"]["interface"] = ele["interface"]["interface"];
					break;
				case "interface-out":
					ep["interface-out"] = {};
					ep["interface-out"]["node-id"] = ele["interface-out"]["node-id"];
					ep["interface-out"]["switch-id"] = ele["interface-out"]["switch-id"];
					ep["interface-out"]["interface"] = ele["interface-out"]["interface"];
					break;
				case "gre-tunnel":
					ep["gre-tunnel"] = {};
					ep["gre-tunnel"]["local-ip"] = ele["gre-tunnel"]["local-ip"];
					ep["gre-tunnel"]["remote-ip"] = ele["gre-tunnel"]["remote-ip"];
					ep["gre-tunnel"]["interface"] = ele["gre-tunnel"]["interface"];
					ep["gre-tunnel"]["ttl"] = ele["gre-tunnel"]["ttl"];
					break;
				case "vlan":
					ep["vlan"] = {};
					ep["vlan"]["vlan-id"] = ele["vlan"]["vlan-id"];
					ep["vlan"]["interface"] = ele["vlan"]["interface"];
					ep["vlan"]["switch-id"] = ele["vlan"]["switch-id"];
					ep["vlan"]["node-id"] = ele["vlan"]["node-id"]
					break;
			}
		}

		forwarding_graph["end-points"].push(ep);
	});

	forwarding_graph["big-switch"] = ser_big();


	return forwarding_graph;

}

function serialize_pos(){
    var file={};
    file.id=fg["forwarding-graph"]["id"];
    file.VNFs=[];
    if(NF_list.length!=0){
        NF_list.forEach(function(nf,i){
            file.VNFs[i]={id:nf.id,x:nf.x,y:nf.y};
            file.VNFs[i].ports=[];
            nf.ports.forEach(function(port,j){
                file.VNFs[i].ports[j]={id:port.id,x:port.x,y:port.y};
            });
        });
    }
    if(EP_list.length!=0){
        file["end-points"]=[];
        EP_list.forEach(function(ep,i){
            file["end-points"][i]={id:ep.id,x:ep.x,y:ep.y,icon:ep.icon};
        });
    }
    if(big_switch!=undefined){
        file["big-switch"]={x:big_switch.x,y:big_switch.y};
        
        file["big-switch"]["interfaces"]= [];

        big_switch.interfaces.forEach(function(ele){
        	var inter = {};
        	inter.id = ele.id;
        	inter.ref = ele.ref;
        	inter.x = ele.x;
        	inter.y = ele.y; 

        	file["big-switch"]["interfaces"].push(inter);
        });


    }
    return JSON.stringify(file);
}


/* This function save the json file of forwarding-graph 
   on the sever */ 

function saveFile(){
	console.log("Save File Ajax");
	$("#SaveFG").modal("hide");
	setKeysWindowListener();

	var file_content_fg = serialize_fg();
	var file_content_pos = serialize_pos();

	var file_name_pos;
	var fileName=$("#nameFile").val().trim();
	if(fileName===""){
		alert("file name non valido!");
		return;
	}
	if(fileName.indexOf(".json")===-1){
		file_name_pos=fileName+"_pos.json";
		fileName+=".json";
	}else if(fileName.indexOf(".json")===0){
		alert("file name non valido!");
		return;
	}else{
		var tmp=fileName.split(".");
		if(tmp.length>2){
			alert("max 1 point");
			return;
		}
		file_name_pos=tmp[0]+"_pos.json";
	}


	var file_name_fg = fileName; /*file fg*/


	 $.ajax({
	 			/* ajax request */
        		url: 'ajax_save_request/', 
                type: 'POST',
                data: { "file_name_fg":file_name_fg,
                        "file_content_fg": file_content_fg,
                        "file_name_pos":file_name_pos,
                        "file_content_pos": file_content_pos
                      } 

            }).done(function(e){

			 	isModified=false;
            	console.log("Success: Files sent!");
            	console.log(e);
    			e=JSON.parse(e);
                showMessageServer(e);
                
                //location.reload();
            
            }).fail(function(){
                
                console.log("An error occurred, the files couldn't be sent!");
            });  


}

/* This function reload the page */

function reloadPage(){
	location.reload();
}

/* Show form for Save json forwarding graph */

function showSaveForm(title){
	if(title!==undefined && title!==null){
		$("#saveTitle").text(title);
        $("#EraseWithoutSaving").show();
	}else{
        $("#saveTitle").text("Save as...");
        $("#EraseWithoutSaving").hide();
    }
    $("#SaveFG").modal("show");
    unSetKeysWindowListener()
}



