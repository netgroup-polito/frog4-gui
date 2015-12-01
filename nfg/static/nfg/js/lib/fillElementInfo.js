function fillNewEP(){
	
	var ep = {};

	ep["name"] = $("#nameEP").val();
	ep["type"] = $("#seltypeEP").val();
	ep["remote_endpoint_id"] = $("#remoteEPid").val();
    ep["id"] = NextIdEP(); 

    $("#idEndPoint").val(ep["id"]);

	switch(ep["type"]){
		case "internal":
			ep["internal"]={}; 
			break;
		case "interface":
			ep["interface"]={};
			ep["interface"]["node"] = $("#node").val();
			ep["interface"]["switch-id"] = $("#switch").val();
			ep["interface"]["interface"] = $("#interface").val();
			break;
		case "interface-out":
			ep["interface-out"]={};
			ep["interface-out"]["node"] = $("#node").val();
			ep["interface-out"]["switch-id"] = $("#switch").val();
			ep["interface-out"]["interface"] = $("#interface").val();
			break;
		case "gre-tunnel":
			ep["gre-tunnel"]={};
			ep["gre-tunnel"]["local-ip"] = $("#localIP").val();
			ep["gre-tunnel"]["remote-ip"] = $("#remoteIP").val();
			ep["gre-tunnel"]["interface"] = $("#greInterface").val();
			ep["gre-tunnel"]["ttl"] = $("#ttl").val();
			break;
		case "vlan":
			ep["vlan"]={};
			ep["vlan"]["vlan-id"] = $("#vlanID").val();
			ep["vlan"]["interface"] = $("#vlanInterface").val();
			ep["vlan"]["switch-id"] = $("#switch").val();
			ep["vlan"]["node"] = $("#vlanNode").val();
			break;

	}

	console.log(ep);

	ep["x"] = "200";
	ep["y"] = "40";
	
    return ep;
}

function updateEP(){
    var ep = {};

    ep["name"] = $("#nameEP").val();
    ep["type"] = $("#seltypeEP").val();
    ep["remote_endpoint_id"] = $("#remoteEPid").val();

    ep["id"] = $("#idEndPoint").val();

    switch(ep["type"]){
        case "internal":
            ep["internal"]={}; 
            break;
        case "interface":
            ep["interface"]={};
            ep["interface"]["node"] = $("#node").val();
            ep["interface"]["switch-id"] = $("#switch").val();
            ep["interface"]["interface"] = $("#interface").val();
            break;
        case "interface-out":
            ep["interface-out"]={};
            ep["interface-out"]["node"] = $("#node").val();
            ep["interface-out"]["switch-id"] = $("#switch").val();
            ep["interface-out"]["interface"] = $("#interface").val();
            break;
        case "gre-tunnel":
            ep["gre-tunnel"]={};
            ep["gre-tunnel"]["local-ip"] = $("#localIP").val();
            ep["gre-tunnel"]["remote-ip"] = $("#remoteIP").val();
            ep["gre-tunnel"]["interface"] = $("#greInterface").val();
            ep["gre-tunnel"]["ttl"] = $("#ttl").val();
            break;
        case "vlan":
            ep["vlan"]={};
            ep["vlan"]["vlan-id"] = $("#vlanID").val();
            ep["vlan"]["interface"] = $("#vlanInterface").val();
            ep["vlan"]["switch-id"] = $("#switch").val();
            ep["vlan"]["node"] = $("#vlanNode").val();
            break;

    }

    console.log(ep);

    ep["x"] = "200";
    ep["y"] = "40";
    
    return ep;

} 

function fillNewVNF(){

    var vnf = {};
    var port = {};

    vnf["x"] = "400";
    vnf["y"] = "40";
    
    vnf["id"] = $("#idVNF").val();
    vnf["name"] = $("#nameVNF").val();
    vnf["vnf_template"] = template_js.name;
    vnf["ports"] = [];

    var ports_template = template_js.ports;

    ports_template.forEach(function(port_t){
        num_port = $("#MinMax"+port_t.label).val();
        console.log(num_port);
        
        for(var i=0;i<num_port;i++){
            port = {};
            port.id = port_t.label+":"+i;
            port.name = port_t.name+i;

            port.x = 0+i*8;
            port.y = "0";
            port.parent_NF_x = vnf["x"];
            port.parent_NF_y = vnf["y"];

            port.parent_NF_id = $("#idVNF").val();
            vnf["ports"].push(port);
        }

    });

    console.log(vnf);
       
    return vnf;
}


function NextIdEP(){
    var len=EP_list.length;
    var newid = parseInt(EP_list[len-1].id)+1;
    var s_id;
    if(newid<10){
        s_id="0000000"+newid;
    }else{
        s_id="000000"+newid;
    }
    return s_id;
}

function validateNewEndPoint(endpoint){
    var validate = true;
    if(endpoint.id==""){ validate = false;
                           console.log("id null");}   /*required*/
    if(endpoint.type!="internal" && endpoint.type!="interface" && endpoint.type!="interface-out" && endpoint.type!="gre-tunnel" && endpoint.type!="vlan"){
        validate=false;
        console.log(endpoint.type);
        console.log("tipo non valido");

    } 
    switch(endpoint.type){
        case "internal":
            break;
        case "interface":
            var inter = endpoint["interface"];
            if(inter["interface"]=="") {
                $("#interface").parent().parent().attr("class","form-group has-error has-feedback");
                validate=false;
            }
            break;
        case "interface-out":
            var inter = endpoint["interface-out"];
            if(inter["interface"]=="") {
                $("#interface").parent().parent().attr("class","form-group has-error has-feedback");
                validate=false;
            }
            break;
        case "gre-tunnel":
            var inter = endpoint["gre-tunnel"];
            if(inter["local-ip"]==""){
                $("#localIP").parent().parent().attr("class","form-group has-error has-feedback");
                validate=false;

            }
            if(inter["remote-ip"]==""){
                $("#remoteIP").parent().parent().attr("class","form-group has-error has-feedback");
                validate=false;

            }
            if(inter["interface"]==""){
                $("#greInterface").parent().parent().attr("class","form-group has-error has-feedback");
                validate=false;
            } 
            break;
        case "vlan":
            var inter = endpoint["vlan"];
            if(inter["vlan-id"]==""){        
                $("#vlanID").parent().parent().attr("class","form-group has-error has-feedback");
                validate=false;

            }
            if(inter["interface"]==""){
                $("#vlanInterface").parent().parent().attr("class","form-group has-error has-feedback");
                validate=false;
            } 
            break;
    }

    

    return validate;
}

/***************************************************************************************/
/*                                  VNF fill                                           */
/***************************************************************************************/

function NextIdVNF(){
    var len=NF_list.length;
    var newid = parseInt(NF_list[len-1].id)+1;
    var s_id;
    if(newid<10){
        s_id="0000000"+newid;
    }else{
        s_id="000000"+newid;
    }
    return s_id;
}

function fillTemplateVNF(template){
    $("#idVNF").val(NextIdVNF());

    $("#idExpandable").val(template["expandable"]);
    $("#idUri").val(template["uri"]);
    
    $("#idType").val(template["vnf-type"]);
    $("#idMemorySize").val(template["memory-size"]);
    $("#idRoot").val(template["root-file-system-size"]);
    $("#idRootFileSystemSize").val(template["root-file-system-size"]);
    $("#idSwapDiskSize").val(template["swap-disk-size"]);
}









