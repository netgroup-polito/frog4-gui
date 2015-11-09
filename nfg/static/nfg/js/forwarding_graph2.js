function Draw(fg){
//definizione delle costanti:
    var svg_width = 960,svg_height = 500, NF_width=120,NF_height=50,NF_offset_x=10,NF_offset_y=10,
    r_interface=8,r_endpoint=15;

    var svg = d3.select(".my_canvas").append("svg")
            .attr("width", svg_width)
            .attr("height", svg_height);
    //per debug creo un contorno attorno al mio svg così vedo il posizionamento del canvas

    svg.append("rect")
            .attr("x","0")
            .attr("y","0")
            .attr("width",svg_width)
            .attr("height",svg_height)
            .attr("stroke","black").style("fill","none");

    //drag and drop dell'intero NF
    var drag_NF = d3.behavior.drag()
            .on("drag",function(d) {
                //al drag riporto il centro dell'oggetto NF alle coordinate del mouse (trovate con d3.event.x/.y)
                var x=parseInt(d3.event.x)-NF_width/2-NF_offset_x,y=parseInt(d3.event.y)-NF_height/2-NF_offset_y;
                d3.select(this).attr("transform","translate("+x+","+y+")")
                        .attr("x",x+NF_offset_x).attr("y",y+NF_offset_y);

            })
            .on("dragstart",function(d){
                console.log(this);
            });

    var drag_EP = d3.behavior.drag()
    		.on("drag",function(d){
    			var cx=parseInt(d3.event.x),cy=parseInt(d3.event.y);
    			d3.select(this).attr("transform","translate("+cx+","+cy+")")
                       // .attr("x",x).attr("y",y);
    		}).on("dragstart",function(d){
                console.log(this);
            });
    //drag and drop solo dell'interfaccia
    var drag_inteface = d3.behavior.drag()
            .on("drag",function(d){
                var x=d3.event.x,y=d3.event.y;
                console.log(x);
                console.log(y);
                if(this.getAttribute("cx")==NF_offset_x || this.getAttribute("cx")==NF_offset_x+NF_width){
//                    if(this.getAttribute("cy")>=NF_offset_y && this.getAttribute("cy")<=NF_height+NF_offset_y)
//                        d3.select(this).attr("cy",d3.event.y);
                    if(d3.event.y<NF_offset_y){ d3.select(this).attr("cy",NF_offset_y);}
                    else if(d3.event.y>NF_height+NF_offset_y){ d3.select(this).attr("cy",NF_height+NF_offset_y);}
                    else d3.select(this).attr("cy",d3.event.y);
                }
                if(this.getAttribute("cy")==NF_offset_y || this.getAttribute("cy")==NF_offset_y+NF_height){
//                    if(this.getAttribute("cx")>=NF_offset_x && this.getAttribute("cx")<=NF_width+NF_offset_x)
//                        d3.select(this).attr("cx",d3.event.x);
                    if(d3.event.x<NF_offset_x){ d3.select(this).attr("cx",NF_offset_x);}
                    else if(d3.event.x>NF_width+NF_offset_x){ d3.select(this).attr("cx",NF_width+NF_offset_x);}
                    else d3.select(this).attr("cx",d3.event.x);
                }

            })
            .on("dragend",function(d){
                console.log("lalalal");console.log(this);
                if(this.getAttribute("cx")==NF_offset_x  || this.getAttribute("cx")==NF_offset_x+NF_width){
                    if(this.getAttribute("cy")<NF_offset_y) d3.select(this).attr("cy",NF_offset_y);
                    if(this.getAttribute("cy")>NF_height+NF_offset_y) d3.select(this).attr("cy",NF_height+NF_offset_y);
                }
                if(this.getAttribute("cy")==NF_offset_y || this.getAttribute("cy")==NF_offset_y+NF_height){
                    if(this.getAttribute("cx")<NF_offset_x) d3.select(this).attr("cx",NF_offset_x);
                    if(this.getAttribute("cx")>NF_width+NF_offset_x) d3.select(this).attr("cx",NF_width+NF_offset_x);
                }
            })
            .on("dragstart",function(d){
                console.log("->>>>");
                console.log(this);
                d3.event.sourceEvent.stopPropagation();
            });

    //vettore di NF simile a quello del json
    console.log(fg["forwarding-graph"]["VNFs"]);
    var NFS_list2 = fg["forwarding-graph"]["VNFs"];

    var EP_list = fg["forwarding-graph"]["end-points"];
    console.log(fg["forwarding-graph"]["end-points"]);

    //sto definendo un nuovo oggetto grafico-> il L'NF voglio che sia rettangolare e con certi parametri

    var NF = svg.append("defs").append("g").attr("id","NF_node");
    var NF_select = svg.append("defs").append("g").attr("id","NF_select");

    NF_select.append("rect")
    		.attr("x",NF_offset_x)
            .attr("y",NF_offset_y)
            .attr("width",NF_width)
            .attr("height",NF_height)
            .attr("class","nf-select");

    NF.append("rect")
            .attr("x",NF_offset_x)
            .attr("y",NF_offset_y)
            .attr("width",NF_width)
            .attr("height",NF_height)
            .attr("class","nf");
            
       
    NFS_list2.forEach(function(ele,index){
        var group = svg.append("g");
        group.append("use").attr("xlink:href","#NF_node") //ogni NF ha un NF_node centrale e attorno tutte le interfacce
        				   .attr("id","nfv"+ele.id);

        //disegnamo le interfacce
        group.selectAll(".interface")
                .data(ele.ports)
                .enter()
                .append("circle")
                .attr("class","interface")
                .attr("cx",function(){return Math.random()*NF_width+10;})
                .attr("cy","10")
                .attr("r",r_interface)
                .call(drag_inteface);
        group.attr("transform","translate("+110*index+",0)");
        group.attr("x",30).attr("y",30); //coordinate iniziali degli oggetti grafici NF_element (gli ho messi con un offset di 10 e 10)
        group.on("click",function(){
        	console.log("ciao");
        	d3.selectAll("use").attr("xlink:href","#NF_node");
        	d3.select("#nfv"+ele.id).attr("xlink:href","#NF_select");

        	var vnf = getVNFInfoById(fg,ele.id);
         	drawVNFInfo(vnf,ele.id);
        });

        group.call(drag_NF);
    });

	
		//console.log(ele);
		svg.selectAll(".end-points")
		   .data(EP_list)
		   .enter()
		   .append("circle")
		   .attr("class","end-points")
		   .attr("cx",function(){return Math.random()+10;})
		   .attr("cy","10")
		   .attr("r",r_endpoint)
		   .on("click",function(d){
		   		d3.selectAll(".end-points-select").attr("class","end-points")

		   		d3.select(this).attr("class","end-points-select")
		   		//console.log("ciao");
		   		var ep = getEndPointInfoById(fg,d.id);
		   		//console.log(d);
		   		drawEndPointInfo(ep,d.id);	
		   })
		   .call(drag_EP);





}

function drawForwardingGraph(json_data){


	json_data = json_data.replace(/'/g,'"');
	

	//console.log(json_data);

	//console.log(JSON.parse(json_data));
	fg=JSON.parse(json_data);
	Draw(fg);

	console.log(fg["forwarding-graph"].VNFs.length);

	//var endpoint1 = getEndPointInfoById(fg,"00000001");
	//var endpoint2 = getEndPointInfoById(fg,"00000002");
	//var vnf = getVNFInfoById(fg,"00000001");

	//drawEndPointInfoPannelInfo(endpoint1,"00000001");

	//drawVNFInfo(vnf,"00000001");

}

function drawEndPointInfo(endpoint,id){
	$('.info').empty();
	$('.col-sm-3').append('<div class="info"><a href="#"><i class="glyphicon glyphicon-exclamation-sign"></i><strong> Node Info</strong></a><div class="panel panel-default"><div class="panel-heading">Node Id: '+endpoint.id+' </div><div id="end'+endpoint.id+'"class="panel-body"><p><b>Name:</b> '+endpoint.name+'</p><p><b>Type:</b> '+endpoint.type+'</p></div></div></div>');
	$('#end'+endpoint.id).append('<div class="panel panel-default"><div class="panel-body"><p><b>Inteface: </b>'+endpoint.interface.interface+'</p><p><b>Node: </b>'+endpoint.interface.node+'</p></div></div>');
}

function drawVNFInfo(vnf,id){

	$('.info').empty();
	$('.col-sm-3').append('<div class="info"><a href="#"><i class="glyphicon glyphicon-exclamation-sign"></i><strong> VNF Info</strong></a><div class="panel panel-default"><div class="panel-heading">VNF Id: '+vnf.id+' </div><div id="vnf'+vnf.id+'"class="panel-body"><p><b>Name:</b> '+vnf.name+'</p></div></div><div>');

	$('#vnf'+vnf.id).append('<div class="panel panel-default"><div class="panel-body"><p><b>Port: </b>'+vnf.ports[0].id+'</p><p><b>Node: </b>'+vnf.ports[0].name+'</p></div></div>');
	$('#vnf'+vnf.id).append('<div class="panel panel-default"><div class="panel-body"><p><b>Port: </b>'+vnf.ports[1].id+'</p><p><b>Node: </b>'+vnf.ports[1].name+'</p></div></div>')
	
}

function getVNFInfoById(fg,id){
	var vnf;
	fg["forwarding-graph"]["VNFs"].forEach(function(e){
		if(e.id == id){ vnf=e;}
	});

	return vnf;
}

function getEndPointInfoById(fg,id){
	var endpoint;
	fg["forwarding-graph"]["end-points"].forEach(function(e){
		if (e.id == id) {/*console.log(e);*/ endpoint=e;}

	});
	return endpoint;
}


function ajaxGetData(){
	//var p_id = $('#forwarding_graph_selector').val();
	//var csrftoken = getCookie('csrftoken');

	$.ajax({
		type: "GET",
		url: "/nfg/ajax_data_request",  // or just url: "/my-url/path/"
		/*data: {
		   csrfmiddlewaretoken: csrftoken,
		   profile_id: p_id,
		},*/
		success: function(data) {
			console.log(data);
			drawForwardingGraph(data);

			/*if(myjson != ""){
				$("#showSplittingRulesButton").show();
			}*/
		}//,
		/*error: function(xhr, textStatus, errorThrown) {
		   	alert("Please report this error: "+errorThrown+xhr.status+xhr.responseText);
		}*/
	});
}

