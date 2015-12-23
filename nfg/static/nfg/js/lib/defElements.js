/**
 * This file contains the definitions of NF, BIGSWITCH and Arrow graphical objects, in terms of
 * appearance on the canvas.
 *
 * ----> Put at the end of this file any other icons <----
 **/

//VNF
function defNF(){
    var NF = defs_section.append("defs").append("g").attr("id","NF_node");
    NF.append("rect")
        .attr("x",NF_offset_x)
        .attr("y",NF_offset_y)
        .attr("width",NF_width)
        .attr("height",NF_height)
        .attr("class","nf");
    return NF;
}
//VNF selected
function defNF_select(){
    var NF_select = defs_section.append("defs").append("g").attr("id","NF_select");
    NF_select.append("rect")
        .attr("x",NF_offset_x)
        .attr("y",NF_offset_y)
        .attr("width",NF_width)
        .attr("height",NF_height)
        .attr("class","nf-select");
    return NF_select;
}
//BigSwitch
function defBIGSWITCH(){
    var BIG_SWITCH = defs_section.append("defs").append("g").attr("id","BIG_SWITCH_node");
    BIG_SWITCH.append("rect")
        .attr("x",NF_offset_x)
        .attr("y",NF_offset_y)
        .attr("width",BIG_SWITCH_width)
        .attr("height",BIG_SWITCH_height)
        .attr("class","big-switch");
    return BIG_SWITCH;
}
//BigSwitch selected
function defBIGSWITCH_select(){
    var BIG_SWITCH_select = defs_section.append("defs").append("g").attr("id","BIG_SWITCH_select");
    BIG_SWITCH_select.append("rect")
        .attr("x",NF_offset_x)
        .attr("y",NF_offset_y)
        .attr("width",BIG_SWITCH_width)
        .attr("height",BIG_SWITCH_height)
        .attr("class","big-switch-select");
    return BIG_SWITCH_select;
}
//Host Icon Selected
function defImgPcRed(){
    var ImgPcRed = defs_section.append("defs")
       .append('pattern')
       .attr('id','host-select-icon')
       .attr('width', 1)
       .attr('height', 1)
       .attr('patternContentUnits', 'objectBoundingBox')
       .append("svg:image")
       .attr("xlink:xlink:href", "/static/nfg/img/pc-red.png")
       .attr('width', 1)
       .attr('height', 1)
       .attr("preserveAspectRatio", "xMinYMin slice");

    return ImgPcRed;
}
//Host Icon
function defImgPcBlue(){    

    var ImgPcBlue = defs_section.append("defs")
       .append('pattern')
       .attr('id','host-icon')
       .attr('width', 1)
       .attr('height', 1)
       .attr('patternContentUnits', 'objectBoundingBox')
       .append("svg:image")
       .attr("xlink:xlink:href", "/static/nfg/img/pc-blue.png")
       .attr('width', 1)
       .attr('height', 1)
       .attr("preserveAspectRatio", "xMinYMin slice");

    return ImgPcBlue;
}
//Internet Icon
function defImgInternetBlue(){    

    var ImgInternetBlue = defs_section.append("defs")
       .append('pattern')
       .attr('id','internet-icon')
       .attr('width', 1)
       .attr('height', 1)
       .attr('patternContentUnits', 'objectBoundingBox')
       .append("svg:image")
       .attr("xlink:xlink:href", "/static/nfg/img/internet_blue2.png")
       .attr('width', 1)
       .attr('height', 1)
       .attr("preserveAspectRatio", "xMinYMin slice");

    return ImgInternetBlue;
}
//Internet Icon Selected
function defImgInternetRed(){    

    var ImgInternetRed = defs_section.append("defs")
       .append('pattern')
       .attr('id','internet-select-icon')
       .attr('width', 1)
       .attr('height', 1)
       .attr('patternContentUnits', 'objectBoundingBox')
       .append("svg:image")
       .attr("xlink:xlink:href", "/static/nfg/img/internet_red2.png")
       .attr('width', 1)
       .attr('height', 1)
       .attr("preserveAspectRatio", "xMinYMin slice");

    return ImgInternetRed;
}
//Arrows, the changes are few between the 4 types
function defArrow(){
    defs_section.append("defs")
        .append("marker")
        .attr({
            "id":"EPArrow",
            "viewBox":"0 -5 10 10",
            "refX":25,
            "refY":0,
            "markerWidth":5,
            "markerHeight":5,
            "orient":"auto"
        })
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class","arrowHead");

    defs_section.append("defs")
        .append("marker")
        .attr({
            "id":"IntArrow",
            "viewBox":"0 -5 10 10",
            "refX":15,
            "refY":0,
            "markerWidth":5,
            "markerHeight":5,
            "orient":"auto"
        })
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class","arrowHead");

    defs_section.append("defs")
        .append("marker")
        .attr({
            "id":"EPArrowSelected",
            "viewBox":"0 -5 10 10",
            "refX":25,
            "refY":0,
            "markerWidth":5,
            "markerHeight":5,
            "orient":"auto"
        })
        .attr("fill","#ED571C")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class","arrowHead");

    defs_section.append("defs")
        .append("marker")
        .attr({
            "id":"IntArrowSelected",
            "viewBox":"0 -5 10 10",
            "refX":15,
            "refY":0,
            "markerWidth":5,
            "markerHeight":5,
            "orient":"auto"
        })
        .attr("fill","#ED571C")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class","arrowHead");
}


