function Draw(fg){
var width = "100%",
    height = "510px";


var controlPressed = false;
var nodeSelected_x;
var nodeSelected_y;

var force = d3.layout.force()
    .size([width, height])
    .charge(-400)
    .linkDistance(50)
    .on("tick", tick);

var drag = force.drag()
    //.on("dragstart", dragstart);

var svg = d3.select(".my_canvas").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class","my_svg");
    

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node"),
    vnf = svg.selectAll(".vnf");

d3.json("/static/nfg/js/graph2.json", function(error, graph){
  if (error) throw error;

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  link = link.data(graph.links)
    .enter().append("line")
      .attr("class", "link");

      


  graph.nodes.forEach(function(d){
    d.fixed=true;
  });

  graph.VNFs.forEach(function(d){
    d.fixed=true;
  });


  node = node.data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 12)
      //.on("dblclick", dblclick)
      .on("dragstart",dragstart)
      .call(drag);

  vnf = vnf.data(graph.VNFs)
      .enter().append("rect")
        .attr("class","vnf")
        .attr("width","100")
        .attr("height","40")
        .attr("fill","YELLOWGREEN")
        .attr("stroke","black")
        .attr("select","false")
        .on("dragstart",dragstart)
        .on("click",function(d){
          console.log(d);
          
          d3.selectAll(".vnf")
          	.attr("fill","YELLOWGREEN");

          d3.select(this)
          	.attr("fill","red");

          var vnf = getVNFInfoById(fg,d.id);
          drawVNFInfo(vnf,d.id);
        })
        .call(drag);

});

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });

  vnf.attr("x",function(d){ return d.x;})
     .attr("y",function(d){ return d.y;});

}



function dblclick(d) {
  //d3.select(this).classed("fixed", d.fixed = true);
  if(controlPressed){
    console.log("down");
    console.log(d);
    link1 = {source:7,target:10};
    //force
      //.nodes(graph.nodes)
      //.links(link1)
      //.start();

      svg.append("line").attr("class","link")
                        .attr("x1",20)
                        .attr("y1",30)
                        .attr("x2",d.x)
                        .attr("y2",d.y);


  }


}


function dragstart(d) {

  if(controlPressed){
    console.log("down");
    console.log(d);
    link1 = {source:7,target:10};
    //force
      //.nodes(graph.nodes)
      //.links(link1)
      //.start();

      svg.append("line").attr("class","link")
                        .attr("x1",20)
                        .attr("y1",30)
                        .attr("x2",d.x)
                        .attr("y2",d.y);


  }else{

    d3.selectAll(".node").classed("fixed",false);
    d3.select(this).classed("fixed", d.fixed = true);
    nodeSelected_x = d.x;
    nodeSelected_y = d.y;
  }


}

function keyup(){
  d3.event.preventDefault();
  controlPressed = false;
}

function keydown(){
  d3.event.preventDefault();
  if(d3.event.keyCode===66){
    controlPressed = true;
  }
}

d3.select(window).on("keydown",keydown).on("keyup",keyup);

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

function drawEndPointInfoPannelInfo(endpoint,id){
	$('.col-sm-3').append('<hr><a href="#"><i class="glyphicon glyphicon-exclamation-sign"></i><strong> Node Info</strong></a><div class="panel panel-default"><div class="panel-heading">Node Id: '+endpoint.id+' </div><div id="end'+endpoint.id+'"class="panel-body"><p><b>Name:</b> '+endpoint.name+'</p><p><b>Type:</b> '+endpoint.type+'</p></div></div>');
	$('#end'+endpoint.id).append('<div class="panel panel-default"><div class="panel-body"><p><b>Inteface: </b>'+endpoint.interface.interface+'</p><p><b>Node: </b>'+endpoint.interface.node+'</p></div></div>');
}

function drawVNFInfo(vnf,id){

	$('.info').empty();
	$('.col-sm-3').append('<div class="info"><a href="#"><i class="glyphicon glyphicon-exclamation-sign"></i><strong> VNF Info</strong></a><div class="panel panel-default"><div class="panel-heading">VNF Id: '+vnf.id+' </div><div id="vnf'+vnf.id+'"class="panel-body"><p><b>Name:</b> '+vnf.name+'</p></div></div><div>');

	$('#vnf'+vnf.id).append('<div class="panel panel-default"><div class="panel-body"><p><b>Port: </b>'+vnf.ports[0].id+'</p><p><b>Node: </b>'+vnf.ports[0].name+'</p></div></div>');
	$('#vnf'+vnf.id).append('<div class="panel panel-default"><div class="panel-body"><p><b>Port: </b>'+vnf.ports[1].id+'</p><p><b>Node: </b>'+vnf.ports[1].name+'</p></div></div>')
	
}

<<<<<<< HEAD


=======
>>>>>>> cae28063ecd684fd78f87e5c458ee7fefdf44112
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

<<<<<<< HEAD
function getFlowRulesInfoById(fg,id){
  var flowrule;
  fg["forwarding-graph"]["flow-rules"].forEach(function(e){
    if(e.id == id){ flowrule=e; }
  });  
  return flowrule;
}



=======
>>>>>>> cae28063ecd684fd78f87e5c458ee7fefdf44112

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

