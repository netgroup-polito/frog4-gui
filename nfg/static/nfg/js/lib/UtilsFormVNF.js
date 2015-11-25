function drawFormVNF(){
	opt="";

	$(function(){
		$("#seltemplateVNF").change(function(){
			var opt_sel = $("#seltemplateVNF").val();

			switch(opt_sel){

				case "firewall":
					console.log("firewall");
					break;
				case "firewall-web":
					console.log("firewall-web");
					break;
				case "ftp":
					console.log("ftp");
					break;
				case "nat":
					console.log("nat");
					break;
				case "dhcp":
					console.log("dhcp");
					break;
				case "switch":
					console.log("switch");
					break;
			}
		});
	});
}