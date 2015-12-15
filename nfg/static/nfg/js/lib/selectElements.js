/**
 * Created by pc asus on 11/12/2015.
 */

function selectVNFs(d){
    selected_node=this;
    selected_link=undefined;
    /* funzioni per selezionare questo oggetto e deselezionare gli altri */
    deselectAll();
    $(this).attr("href","#NF_select");

    /* funzioni per visualizzare le informazioni sulla sinistra */
    var vnf = getVNFById(d.id);
    drawVNFInfo(vnf,d.id);
}

function selectInternalBSLinks(d){
    if(d.external===true) return;
    selected_link=this;
    selected_node=undefined;

    deselectAll();

    if($(this).attr("fullduplex")==="false") {
        $(this).attr("marker-end", "url(#IntArrowSelected)");
    }
    $(this).attr("class","BS-line-selected");
    drawBigSwitchInfo(fg);

    highlightsFlowRule(d.id);
    if(getDualFR(d.id)!==undefined)
        highlightsFlowRule(getDualFR(d.id).id);

}

function selectEndPoints(d){

    select_node(d);
    selected_node=this;
    selected_link=undefined;
    /* funzioni per selezionare questo oggetto e deselezionare gli altri */

    deselectAll();

    switch(d.name){
        case "host":
            d3.select(this).attr("class","end-points-select "+d.name).style("fill","url(#host-select-icon)");
            break;
        case "internet":
            d3.select(this).attr("class","end-points-select "+d.name).style("fill","url(#internet-select-icon)");
            break;
        default:
            d3.select(this).attr("class","end-points-select "+d.name);
            break;
    }


    /* funzioni per visualizzare le informazioni sulla sinistra */
    var ep = getEndPointById(d.id);
    drawEndPointInfo(ep,d.id);
}

function selectBS(d){
    deselectAll();
    d3.select(".use_BIG").attr("xlink:href","#BIG_SWITCH_select");
    drawBigSwitchInfo(fg);
}

function selectSimpleLines(d){
    selected_link=this;
    selected_node=undefined;
    deselectAll();
    if($(this).attr("fullduplex")==="false") {
        $(this).attr("marker-end", "url(#EPArrowSelected)");
    }
    $(this).attr("class","line-selected");
    console.log(d);

}

function deselectAll(){
    d3.selectAll(".line-selected").attr("class","line");
    d3.selectAll(".BS-line-selected").attr("class","BS-line");
    d3.selectAll(".line[fullduplex=false]").attr("marker-end",function(d){
        var type=$(this).attr("end");
        if(type.indexOf("vnf")===-1)
            return "url(#EPArrow)";
        else return "url(#IntArrow)";
    });
    d3.selectAll(".BS-line[fullduplex=false]").attr("marker-end","url(#IntArrow)");


    d3.selectAll(".host").attr("class","end-points host").style("fill","url(#host-icon)");
    d3.selectAll(".internet").attr("class","end-points internet").style("fill","url(#internet-icon)");

    d3.selectAll(".end-points-select").attr("class","end-points");
    d3.selectAll(".NetworkFunction").attr("xlink:href","#NF_node");
    d3.select(".use_BIG").attr("xlink:href","#BIG_SWITCH_node");
}

function selectNewInternalBSLinks(d){
    console.log(this);
    selected_link=this;
    selected_node=undefined;
    var id=$(this).attr('idfr');
    var id_split=id.split('-');
    id=id_split[1];
    deselectAll();

    if($(this).attr("fullduplex")==="false") {
        $(this).attr("marker-end", "url(#IntArrowSelected)");
    }
    $(this).attr("class","BS-line-selected");
    drawBigSwitchInfo(fg);

    highlightsFlowRule(id);
    if(getDualFR(id)!==undefined)
        highlightsFlowRule(getDualFR(id).id);
}