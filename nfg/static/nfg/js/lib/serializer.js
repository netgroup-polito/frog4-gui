function serialize_fg(){
	var file_fg = {};
	
	file_fg["forwarding-graph"] = ser_fg();
	//file_fg["big-switch"] = ser_big();
	
	console.log(file_fg);
	console.log(JSON.stringify(file_fg))

	return JSON.stringify(file_fg);

}

function ser_big(){

	var big_switch = {};
	big_switch["flow-rules"]=[];

	flow_rules.forEach(function(ele){
		var flowrule = {};
		flowrule["id"] = ele["id"];
		flowrule["priority"] = ele["priority"];
		flowrule["match"] = {};

		var match = {};

		match["hard_timeout"]   = ele["match"]["hard_timeout"];
		match["ether_type"]		= ele["match"]["ether_type"];
		match["vlan_id"]		= ele["match"]["vlan_id"];
		match["vlan_priority"]	= ele["match"]["vlan_priority"];
		match["source_mac"]		= ele["match"]["source_mac"];
		match["dest_mac"]		= ele["match"]["dest_mac"];
		match["source_ip"]		= ele["match"]["source_ip"];
		match["dest_ip"]		= ele["match"]["dest_ip"];
		match["tos_bits"]		= ele["match"]["tos_bits"];
		match["source_port"]	= ele["match"]["source_port"];
		match["dest_port"]		= ele["match"]["dest_port"];
		match["protocol"]		= ele["match"]["protocol"];
		match["port_in"]		= ele["match"]["port_in"];
		
		flowrule["match"]= match;


										 			   

		/* ATTENZIONE: DA SISTEMARE CON VETTORE DI ACTION */

		var actions = [];

		ele_action = ele["action"];

		ele_action.forEach(function(ele2){
			var action = {};
			action["output"] = ele2["output"];
			action["set_vlan_id"] = ele2["set_vlan_id"];
			action["set_vlan_priority-id"] = ele2["set_vlan_priority-id"];
			action["pop_vlan"] = ele2["pop_vlan"];
			action["set_ethernet_src_address"] = ele2["set_ethernet_src_address"];
			action["set_ethernet_dst_address"] = ele2["set_ethernet_dst_address"];
			action["set_ip_src_address"] = ele2["set_ip_src_address"];
			action["set_ip_dst_address"] = ele2["set_ip_dst_address"];
			action["set_ip_tos"] = ele2["set_ip_tos"];
			action["set_l4_src_port"] = ele2["set_l4_src_port"];
			action["set_l4_dst_port"] = ele2["set_l4_dst_port"];
			action["output_to_queue"] = ele2["output_to_queue"];

			actions.push(action);

		});

		flowrule["action"] = actions;
		big_switch["flow-rules"].push(flowrule);
	});

	return big_switch;
}

function ser_fg(){
	var forwarding_graph = {};
	

	forwarding_graph["id"] = fg["forwarding-graph"]["id"];
	forwarding_graph["name"] = fg["forwarding-graph"]["name"];

	forwarding_graph["VNFs"]=[];

	NF_list.forEach(function(ele){
		var vnf = {};
		vnf["id"]	=ele["id"];
		vnf["name"]	=ele["name"];
		vnf["vnf_template"]=ele["vnf_template"];
		vnf["ports"]=[];

		ele.ports.forEach(function(ele2){
			var port = {};
			port["id"]	=ele2.id;
			port["name"]=ele2.name;

			vnf["ports"].push(port);
		});
		forwarding_graph["VNFs"].push(vnf);
	});

	forwarding_graph["end-points"]=[];

	EP_list.forEach(function(ele){
		var ep = {};
		ep["id"] = ele["id"];
		ep["name"] = ele["name"];
		ep["type"] = ele["type"];
		ep["remote_endpoint_id"] = ele["remote_endpoint_id"];
		//ep["prepare_connection_to_remote_endpoint_ids"] = ele["prepare_connection_to_remote_endpoint_ids"];
		

		/* controllo sul tipo di end point */

		switch(ep["type"]){
			case "internal":
				ep["internal"]={}; 
				break;
			case "interface":
				ep["interface"]={};
				ep["interface"]["node"] = ele["interface"]["node"];
				ep["interface"]["switch-id"] = ele["interface"]["switch-id"];
				ep["interface"]["interface"] = ele["interface"]["interface"];
				break;
			case "interface-out":
				ep["interface-out"]={};
				ep["interface-out"]["node"] = ele["interface-out"]["node"];
				ep["interface-out"]["switch-id"] = ele["interface-out"]["switch-id"];
				ep["interface-out"]["interface"] = ele["interface-out"]["interface"];
				break;
			case "gre-tunnel":
				ep["gre-tunnel"]={};
				ep["gre-tunnel"]["local-ip"] = ele["gre-tunnel"]["local-ip"];
				ep["gre-tunnel"]["remote-ip"] = ele["gre-tunnel"]["remote-ip"];
				ep["gre-tunnel"]["interface"] = ele["gre-tunnel"]["interface"];
				ep["gre-tunnel"]["ttl"] = ele["gre-tunnel"]["ttl"];
				break;
			case "vlan":
				ep["vlan"]={};
				ep["vlan"]["vlan-id"] = ele["vlan"]["vlan-id"];
				ep["vlan"]["interface"] = ele["vlan"]["interface"];
				ep["vlan"]["switch-id"] = ele["vlan"]["switch-id"];
				ep["vlan"]["node"] = ele["vlan"]["node"]
				break;

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
            file["end-points"][i]={id:ep.id,x:ep.x,y:ep.y};
        });
    }
    if(big_switch!=undefined){
        file["big-switch"]={x:big_switch.x,y:big_switch.y};
        
        file["big-switch"]["interfaces"]= [];

        big_switch.interfaces.forEach(function(ele){
        	inter = {}
        	inter.id = ele.id;
        	inter.ref = ele.ref;
        	inter.x = ele.x;
        	inter.y = ele.y; 

        	file["big-switch"]["interfaces"].push(inter);
        });

        /*
        file["big-switch"]["flow-rules"] = [];

        flow_rules = big_switch["flow-rules"];

        flow_rules.forEach(function(ele){
        	flow_rule = {};
        	flow_rule.id = ele.id;
        	flow_rule.full_duplex = ele.full_duplex;

        	flow_rule.action=[];
        	ele.action.forEach(function(ele2){
        		act = {};
        		act.interface_position_x = ele2.interface_position_x;
        		act.interface_position_y = ele2.interface_position_y;
        		act.output = ele2.output;

        		flow_rule.action.push(act);
        	})

        	flow_rule.match={};

        	match={};
        	match.interface_position_x=ele.match.interface_position_x;
        	match.interface_position_y=ele.match.interface_position_y;
        	
        	match.port_in=ele.port_in;

        	flow_rule.match = match;

        	flow_rules.push(flow_rule);

        });

        file["big-switch"]["flow-rules"]=flow_rules;
        */


    }
    return JSON.stringify(file);
}

function saveFile(){
	console.log("Save File Ajax");

	var file_content_fg = serialize_fg();
	var file_content_pos = serialize_pos();

	var file_name_fg = fg["forwarding-graph"]["id"]+".json";		/*file fg*/
	var file_name_pos = fg["forwarding-graph"]["id"]+"_pos.json";	/*file posizionamento*/


	 $.ajax({

        		url: 'ajax_save_request/', 
                type: 'POST',
                data: { "file_name_fg":file_name_fg,
                        "file_content_fg": file_content_fg,
                        "file_name_pos":file_name_pos,
                        "file_content_pos": file_content_pos
                      } // file inputs.

            }).done(function(e){
                                
                console.log("Success: Files sent!");
                //location.reload();
            
            }).fail(function(){
                
                console.log("An error occurred, the files couldn't be sent!");
            });  


}



