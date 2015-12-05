/**
 * Created by pc asus on 22/11/2015.
 */

function select_node(ele){
    if(NF_view===false && ele.ref!=="bsInt") return;
    if(creating_link===true){ //possiamo creare un link
        if(ele1_selected===undefined){
            ele1_selected=ele;
            createTempLink();
        }else if(ele2_selected===undefined){
            if(ele1_selected.ref==="bsInt" && ele.ref!=="bsInt") return;
            if(ele1_selected.ref!=="bsInt" && ele.ref==="bsInt") return;
            ele2_selected=ele;
            deleteTempLink();
            /*
             * QUA INSERIRE FINESTRA INSERIMENTO DATI FLOWS RULE
             */
                console.log("showModalFlow");

                $("#idFlowRule").val(NextIdFlowRule());
                $("#idPortIn").val(ele1_selected.id);
                $("#idOutput").val(ele2_selected.id);
                $("#ModalFlowRules").modal("show");


            //var newFR={};
            //newFR.campo1={};
            //flow_rules.add(newFR);
            //createLink();
        }
    }
}

function DrawNewLink(){
    var newFR = fillNewFlowRule();
    flow_rules.push(newFR);
    createLink();
}



function deleteTempLink(){
    $("#my_canvas").css("cursor","default");
    creating_link=false;
    svg.on("mousemove",null);
    lines_section.select("#newTmpLine").remove();
}
function createTempLink(){
    var x1,y1,x2,y2;
    if(ele1_selected.ref==="bsInt" ){
        x1=ele1_selected.x+big_switch.x;
        y1=ele1_selected.y+big_switch.y;
    }

    if(ele1_selected.ref==="end-point"){
        x1=ele1_selected.x;
        y1=ele1_selected.y;
    }
    if(ele1_selected.ref==="NF_interface"){
        x1=parseInt(ele1_selected.x)+parseInt(ele1_selected.parent_NF_x);
        y1=parseInt(ele1_selected.y)+parseInt(ele1_selected.parent_NF_y);
    }
    var newLine=lines_section.append("line")
        .attr("x1",x1)
        .attr("y1",y1)
        .attr("id","newTmpLine")
        .attr("stroke","green")
        .style("stroke-dasharray",("3,3"))
        .attr("class","line");

    svg.on("mousemove",function(){

        var coordinates = [0, 0];
        coordinates = d3.mouse(this);
        var x = coordinates[0];
        var y = coordinates[1];
        //console.log("x: "+x);
        //console.log("y: "+y);
        newLine.attr("x2",x)
            .attr("y2",y);

    });
}
function createLink(){
    console.log(ele1_selected);
    console.log(ele2_selected);
    var x1,y1,x2,y2,id1,id2;
    if(ele1_selected.ref==="bsInt"){
        x1=ele1_selected.x+big_switch.x;
        y1=ele1_selected.y+big_switch.y;
        x2=ele2_selected.x+big_switch.x;
        y2=ele2_selected.y+big_switch.y;
    }else {
        if (ele1_selected.ref === "end-point") {
            x1 = ele1_selected.x;
            y1 = ele1_selected.y;
            id1 = "endpoint:" + ele1_selected.id;
        }
        if (ele1_selected.ref === "NF_interface") {
            x1 = parseInt(ele1_selected.x) + parseInt(ele1_selected.parent_NF_x);
            y1 = parseInt(ele1_selected.y) + parseInt(ele1_selected.parent_NF_y);
            id1 = "vnf:" + ele1_selected.parent_NF_id + ":" + ele1_selected.id;
        }
        if (ele2_selected.ref === "end-point") {
            x2 = ele2_selected.x;
            y2 = ele2_selected.y;
            id2 = "endpoint:" + ele2_selected.id;
        }
        if (ele2_selected.ref === "NF_interface") {
            x2 = parseInt(ele2_selected.x) + parseInt(ele2_selected.parent_NF_x);
            y2 = parseInt(ele2_selected.y) + parseInt(ele2_selected.parent_NF_y);
            id2 = "vnf:" + ele2_selected.parent_NF_id + ":" + ele2_selected.id;
        }
    }
    var newLine=lines_section.append("line")
        .attr("x1",x1)
        .attr("y1",y1)
        .attr("x2",x2)
        .attr("y2",y2)
        .attr("stroke","black")
        .attr("class","line")
        .attr("start",id1)
        .attr("end",id2)
        .on("click",function(){
            selected_link=this;
            d3.select(this).attr("stroke","red");
        });
    if(ele1_selected.ref==="bsInt") {
        newLine.attr("opacity", 0.6);
        newLine.attr("class","BS_line")
    }
    //NB->DA FARE modificare il js!!!
    //svg.selectAll("line,circle").sort(function(a){console.log(a);});
    //svg.selectAll("line,circle").order();
    ele1_selected=undefined;
    ele2_selected=undefined;

}