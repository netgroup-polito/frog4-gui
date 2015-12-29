/* In this file thre are all functions to manage 
   the VNF form */ 



function drawFormVNF(){
	opt="";
	var template = "";
    $('#seltemplateVNF').removeAttr('disabled');
	$(function(){
		$("#seltemplateVNF").change(function(){
			var opt_sel = $("#seltemplateVNF").val();            

			switch(opt_sel){
				case "Firewall":
					console.log("firewall");
					template = "firewall";				
					break;

				case "Firewall-web":
					console.log("firewall-web");
					template = "firewall_web";
					break;

				case "Ftp":
					console.log("ftp");
					template = "ftp";
					break;

				case "Nat":
					console.log("nat");
					template = "nat";
					break;

				case "Dhcp":
					console.log("dhcp");
					template = "dhcp";
					break;

				case "Switch":
					console.log("switch");
					template = "switch";
					break;

				case "Iptraf":
					console.log("iptraf");
					template = "iptraf";
					
			}
            /* ajax request for json template VNF */
			$.ajax({ type: "GET",url: "/nfg/ajax_template_request/"+template+"/",
      					success: function(data) {FuncSuccess(data);} });	
		});
	});
}

function addFormPort(){
	console.log(template_js);
	var port_template = template_js.ports;

            $html = '<div class="boxPort">'+
                    '    <div class="form-group">'+
                    '        <label class="control-label col-sm-2" for="title" id="titleInterface"><a>Ports info:</a></label>'+     
                    '        <div class="col-sm-10">'+
                    '    </div>'+          
                    '</div>';
          
                    port_template.forEach(function(port_t){
                    	console.log(port_t);
                    	$html +='<div class="form-group" >'+
                    				'<label class="control-label col-sm-2" for="typeInterface" >Label: '+port_t.label+'</label>'+
                						'<div class="col-sm-10">'+
                            				'<select class="form-control" name="MInMax" id="MinMax'+port_t.label+'">';

                            					var split = port_t.position.split("-");
                            					var p_num = parseInt(split[0]);
                    							var s_num = parseInt(split[1]);

                    							if(s_num == 'N'){s_num = 63;}
                    							console.log(s_num,p_num,s_num-p_num);

                    							for(var i=parseInt(port_t.min);i<=parseInt(port_t.min)+(s_num-p_num);i++){
                                                    if(i===parseInt(port_t.min)){
                                                        $html+= '<option selected>'+i+'</option>';
                                                    }else{
                                                        $html+= '<option>'+i+'</option>';
                                                    }
                    								
                    							}                                				
                            				$html +='</select>'+
                        				'</div>'+
                    			'</div>';                    				
                   		});
                    
            $html+= '</div>'+
                    '</div>'+
                    '</div>';

                $("#infoPort").append($html);            
            }

function FuncSuccess(data){

    data = data.replace(/'/g,'"');

    template_js=JSON.parse(data);
    console.log(template_js);
    fillTemplateVNF(template_js);
    $('#infoPort').empty();
    addFormPort();

}

function showEditInfoVNF(idVNF){
    $('#FormNF').modal('show');
    unSetKeysWindowListener();
    console.log("hhhhh"+idVNF);
    FillFormEditVNF(idVNF);
    
}

function FillFormInfoVNF(idVNF){
    var template;
    var vnf;
    NF_list.forEach(function(ele){
        if(parseInt(ele.id) == idVNF){
            vnf = ele;
            return vnf;
        }
    });

    
    console.log(vnf);
     console.log(vnf.id);
    $("#idVNF").val(vnf.id);
    $("#nameVNF").val(vnf.name);
    
    console.log(vnf.vnf_template);

    switch(vnf.vnf_template){
                case "firewall.json":
                    console.log("firewall");
                    $('#seltemplateVNF' ).val('Firewall');
                    template = "firewall";              
                    break;

                case "firewall_web.json":
                    console.log("firewall-web");
                    $("#seltemplateVNF").val("Firewall-web");
                    template = "firewall_web";
                    break;

                case "ftp.json":
                    console.log("ftp");
                    $("#seltemplateVNF").val("Ftp");
                    template = "ftp";
                    break;

                case "nat.json":
                    console.log("nat");
                    $("#seltemplateVNF").val("Nat");
                    template = "nat";
                    break;

                case "dhcp.json":
                    console.log("dhcp");
                    $("#seltemplateVNF").val("Dhcp");
                    template = "dhcp";
                    break;

                case "switch.json":
                    console.log("switch");
                    $("#seltemplateVNF").val("Switch");
                    template = "switch";
                    break;

                case "iptraf.json":
                    console.log("iptraf");
                    $("#seltemplateVNF").val("Iptraf");
                    template = "iptraf";
                    
            }

            $('#infoPort').empty();

    $("#saveVNF").attr("onclick","saveNewVNF()");
    $("#saveVNF").html("Save VNF");

}




