function Draw(){
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
    .attr("class","my_svg")
    /*.attr("border","1px")
    .attr("border-color","black")*/;
    

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

d3.json("/static/nfg/js/graph2.json", function(error, graph) {
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


  node = node.data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 12)
      //.on("dblclick", dblclick)
      .on("click",function(d){console.log(d)})
      .on("dragstart",dragstart)
      .call(drag);



});

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
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


