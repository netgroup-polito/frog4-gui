/**
 * This file contains the definitions of NF and BIGSWITCH graphical objects
 *
 **/


function defNF(){
    var NF = svg.append("defs").append("g").attr("id","NF_node");
    NF.append("rect")
        .attr("x",NF_offset_x)
        .attr("y",NF_offset_y)
        .attr("width",NF_width)
        .attr("height",NF_height)
        .attr("class","nf");
    return NF;}
function defNF_select(){
    var NF_select = svg.append("defs").append("g").attr("id","NF_select");
    NF_select.append("rect")
        .attr("x",NF_offset_x)
        .attr("y",NF_offset_y)
        .attr("width",NF_width)
        .attr("height",NF_height)
        .attr("class","nf-select");
    return NF_select;}
function defBIGSWITCH(){
    var BIG_SWITCH = svg.append("defs").append("g").attr("id","BIG_SWITCH_node");
    BIG_SWITCH.append("rect")
        .attr("x",NF_offset_x)
        .attr("y",NF_offset_y)
        .attr("width",BIG_SWITCH_width)
        .attr("height",BIG_SWITCH_height)
        .attr("class","big-switch");
    return BIG_SWITCH;}
function defBIGSWITCH_select(){
    var BIG_SWITCH_select = svg.append("defs").append("g").attr("id","BIG_SWITCH_select");
    BIG_SWITCH_select.append("rect")
        .attr("x",NF_offset_x)
        .attr("y",NF_offset_y)
        .attr("width",BIG_SWITCH_width)
        .attr("height",BIG_SWITCH_height)
        .attr("class","big-switch-select");
    return BIG_SWITCH_select;}

function defImgPcRed(){
    var ImgPcRed = svg.append("defs")
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

function defImgPcBlue(){    

    var ImgPcBlue = svg.append("defs")
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

function defImgInternetBlue(){    

    var ImgInternetBlue = svg.append("defs")
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

function defImgInternetRed(){    

    var ImgInternetRed = svg.append("defs")
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




