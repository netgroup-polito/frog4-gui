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
    var vnf2={
                    "x":"400",
                    "y":"40",

                    "vnf_template": "firewall80.json",
                    "id": "00000003",
                    "name": "NAT",
                    "ports": [
                        {
                            "x":"0",
                            "y":"0",
                            "parent_NF_x":"400",
                            "parent_NF_y":"40",
                            "parent_NF_id":"00000003",
                            "id": "User:0",
                            "name": "User side interface"
                        },
                        {   "x":"120",
                            "y":"0",
                            "parent_NF_x":"400",
                            "parent_NF_y":"40",
                            "parent_NF_id":"00000003",
                            "id": "WAN:0",
                            "name": "WAN side interface"
                        }
                    ]
                }

    var vnf = {};
    var port = {};

    vnf["x"] = "400";
    vnf["y"] = "40";

    
    vnf["id"] = "00000003";
    vnf["name"] = $("#nameVNF").val();
    vnf["vnf_template"] = $("#idVNF").val();
    vnf["ports"] = [];


    for(var i=0;i<num;i++){

        console.log(i);
        port["x"] = 0+i*10;
        port["y"] = "0";
        port["parent_NF_x"] = "400";
        port["parent_NF_y"] = "40";

        port["parent_NF_id"] = vnf["id"];
        port["id"] = "User:"+i;
        console.log(port["id"]);

        port["name"] = $("#namePort"+(i+1)).val();
        console.log(port["name"]);

        vnf["ports"].push(port);

        console.log(port);

    }
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



