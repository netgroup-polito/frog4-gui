//function drawEPMenu(){
//    //console.log("ciao");
//
//    svg_menu.append("circle")
//            .attr("class","end-points")
//            //.attr("id",function(d){return "endpoint:"+d.id;})
//            .attr("r",r_endpoint)
//            .attr("cx",200)
//            .attr("cy",40)
//            .on("click",function(){
//
//                    $('#FormEP').modal('show');
//                    unSetKeysWindowListener();
//                    $('#seltypeEP' ).val('internal');
//                    /*reset*/
//                    resetFormEp();
//                    $("#idEndPoint").val(NextIdEP());
//
//                    $("#saveEP").attr("onclick","drawNewEP()");
//                    $("#saveEP").html("Add End Point");
//            });
//}

//function drawNFMenu(){
//    svg_menu.append("rect")
//            .attr("class","nf")
//            .attr("x",400)
//            .attr("y",20)
//            .attr("width",NF_width)
//            .attr("height",NF_height)
//            .on("click",function(){
//
//                $('#FormNF').modal('show');
//                unSetKeysWindowListener();
//                $('#seltemplateVNF' ).val('Firewall');
//
//                $("#idVNF").val(NextIdVNF());
//                $("#saveVNF").attr("onclick","drawNewNF()");
//                $("#saveVNF").html("Add VNF");
//                $('#seltemplateVNF').removeAttr('disabled');
//
//                /* Template di default Firewall */
//                $.ajax({ type: "GET",url: "/nfg/ajax_template_request/firewall/",
//                         success: function(data) {FuncSuccess(data);} });
//
//            });}
//

function drawNewEP(){
    var ele=[];

    var ep = fillNewEP();
    ep.fullId="endpoint:"+ep.id;
    ep.ref="end-point";
    ep.isLinked=false;
    console.log(validateNewEndPoint(ep));
    if(validateNewEndPoint(ep)===true){
        isModified=true;
        setKeysWindowListener();
        $('#FormEP').modal('hide');
        setKeysWindowListener();
        ele.push(ep);

        /* aggiungo l'oggetto ep appena creato alla lista degli ep */
        EP_list.push(ele[0]);

        /* creo un nuovo oggetto bs_interface e lo aggiungo alla lista delle interfacce del BS*/
        var new_bs_int={};
        new_bs_int.ref = "bsInt";
        new_bs_int.id = "endpoint:"+ep.id;
        new_bs_int.fullId=new_bs_int.id;
        new_bs_int.x=0;
        new_bs_int.y=0;
        big_switch.interfaces.push(new_bs_int);

        /*disegno l'oggetto ep*/
        drawEP(ele);
        
        drawSingleBSInterfaceAndExternalLink(new_bs_int,ep);
        
        updateView();
        updateTooltips();
    }else{
        console.log("validazione fallita");
    }
}



function drawNewNF(){
    isModified=true;
    var vnf = fillNewVNF();
    $('#FormNF').modal('hide');
    setKeysWindowListener();

    var new_int=[];
    var new_bs_links=[];

    vnf.ports.forEach(function(port,i){
        /* sistemo in numbers*/
        port.x=22*i%NF_width;
        port.y=parseInt(port.y);
        port.parent_NF_x=parseInt(port.parent_NF_x);
        port.parent_NF_y=parseInt(port.parent_NF_y);
        port.ref="NF_interface";
        port.fullId="vnf:"+vnf.id+":"+port.id;
        /* creo un nuovo oggetto bs_interface e lo aggiungo alla lista delle interfacce del BS*/
        var newBSInt={};
        newBSInt.ref = "bsInt";
        newBSInt.id_vnf= vnf.id;
        newBSInt.id = "vnf:"+vnf.id+":"+port.id;
        newBSInt.fullId = "vnf:"+vnf.id+":"+port.id;
       // var temp={x:parseInt(port.parent_NF_x)+parseInt(port.x),y:parseInt(port.parent_NF_y)+parseInt(port.y)};
        newBSInt.x=22*i%BIG_SWITCH_width;
        newBSInt.y=0;

        var newLink={};
        newLink.x1=parseInt(port.x)+port.parent_NF_x;
        newLink.y1=parseInt(port.y)+port.parent_NF_y;
        newLink.x2=newBSInt.x+big_switch.x;
        newLink.y2=newBSInt.y+big_switch.y;
        newLink.start=newBSInt.id;
        newLink.end="bs-"+newBSInt.id;
        newLink.external=true;

        new_bs_links.push(newLink);
        new_int.push(newBSInt);
        big_switch.interfaces.push(newBSInt);
    });
    /*aggiungo alla lista delle NF il nuovo elemento*/
    NF_list.push(vnf);


    var ele = [];   ele.push(vnf);

    drawNF_text(ele);
    //VNF_text_section.selectAll(".NewNetworkFunction_text")
    //    .data(ele)
    //    .enter()
    //    .append("text")
    //    .attr("fill","white")
    //    .text(function(d){
    //        var text;
    //        if(d.name==null || d.name == undefined || d.name == ""){
    //            text = "NaN";
    //        }else if(d.name.length>=18){
    //            text = d.name.slice(0,18);
    //            console.log(text);
    //        }else{
    //            text = d.name;
    //        }
    //        return text;
    //    })
    //    .attr("id",function(d){return "text_"+d.id;})
    //    .attr("class","NetworkFunction_text")
    //    .attr("x",function(d){return d.x+20;})
    //    .attr("y",function(d){return d.y+NF_height/2+5;});

    drawNF(ele);
    //VNF_section.selectAll(".NewNetworkFunction")
    //        .data(ele)
    //        .enter()
    //        .append("use").attr("xlink:href", "#NF_node")
    //        .attr("id", function(d){return d.id;})
    //        .attr("class", "NetworkFunction") //ogni NF ha un NF_node centrale e attorno tutte le interfacce
    //        .attr("x",function(d){return d.x;})
    //        .attr("y",function(d){return d.y;})
    //        //.attr("transform","translate("+NF_list[index].x+","+NF_list[index].y+")")
    //        .call(drag_NF)
    //        .on("mousedown",function(d){ //da sistemare!
    //        //    console.log(this);
    //        ///* funzioni per selezionare questo oggetto e deselezionare gli altri */
    //        //    d3.selectAll(".end-points-select").attr("class","end-points");
    //        //    //d3.selectAll(".BigSwitch").attr("xlink:href","#BIG_SWITCH_node");
    //        //    d3.selectAll(".NetworkFunction").attr("xlink:href","#NF_node");
    //        //    $(this).attr("href","#NF_select");
    //        //   // d3.select(d).attr("xlink:href","#NF_select");
    //        //    /* funzioni per visualizzare le informazioni sulla sinistra */
    //        //    var vnf = getVNFById(d.id);
    //        //    drawVNFInfo(vnf,d.id);
    //            selected_node=this;
    //            selected_link=undefined;
    //            /* funzioni per selezionare questo oggetto e deselezionare gli altri */
    //
    //            d3.selectAll(".line-selected").attr("class","line");
    //            d3.selectAll(".BS-line-selected").attr("class","BS-line");
    //            d3.selectAll(".line[fullduplex=false]").attr("marker-end",function(d){
    //                var type=$(this).attr("end");
    //                if(type.indexOf("vnf")===-1) return "url(#EPArrow)"
    //                else return "url(#IntArrow)";
    //            });
    //            d3.selectAll(".BS-line[fullduplex=false]").attr("marker-end","url(#IntArrow)");
    //
    //            d3.selectAll(".host").attr("class","end-points host").style("fill","url(#host-icon)");
    //            d3.selectAll(".internet").attr("class","end-points internet").style("fill","url(#internet-icon)");
    //            d3.selectAll(".end-points-select").attr("class","end-points");
    //
    //            //d3.selectAll(".BigSwitch").attr("xlink:href","#BIG_SWITCH_node");
    //            d3.selectAll(".NetworkFunction").attr("xlink:href","#NF_node");
    //            d3.selectAll(".use_BIG").attr("xlink:href","#BIG_SWITCH_node");
    //            $(this).attr("href","#NF_select");
    //            // d3.select(d).attr("xlink:href","#NF_select");
    //            /* funzioni per visualizzare le informazioni sulla sinistra */
    //            var vnf = getVNFById(d.id);
    //            drawVNFInfo(vnf,d.id);
    //         });


    drawVNF_interfaces(ele[0].ports);
    //interfaces_section.selectAll(".new_interface")
    //        .data(ele[0].ports)
    //        .enter()
    //        .append("circle")
    //        .attr("class","interface")
    //        .attr("cx",function(d){return parseInt(d.x)+parseInt(d.parent_NF_x);})
    //        .attr("cy",function(d){return parseInt(d.y)+parseInt(d.parent_NF_y);})
    //        .attr("r",r_interface)
    //        .attr("parent_NF_position_x",function(d){return d.parent_NF_x;})
    //        .attr("parent_NF_position_y",function(d){return d.parent_NF_y;})
    //        .attr("parent",function(d){return "vnf"+d.parent_NF_id;})
    //        .attr("id",function(d){return "vnf:"+ d.parent_NF_id+":"+d.id;})
    //    .on("click",select_node)
    //        .call(drag_INTERFACE);




    /*      aggiungo un nuovo elemento grafico bsInt     */
    drawBSInterfaces(new_int);
    //interfaces_section
    //    .selectAll(".newBSint")
    //    .data(new_int)
    //    .enter()
    //    .append("circle")
    //    .attr("class","BS_interface interface")
    //    .attr("cx",function(d){ return big_switch.x + d.x;})
    //    .attr("cy",function(d){ return big_switch.y + d.y;})
    //    .attr("id",function(d){ return d.id;})
    //    .attr("title",function(d){return d.id;})
    //    .attr("r",r_interface)
    //    .attr("title",function(d){  return d.id; })
    //    .on("click",select_node)
    //    .call(drag_INTERFACEBIGSWITCH);

    /*disegno il link che collega il bs_int al vnf*/
    drawBSLinks(new_bs_links);
    //var lines = lines_section.selectAll(".NEWBS_line")
    //    .data(new_bs_links)
    //    .enter()
    //    .append("line")
    //    .attr("class","BS-line")
    //    .attr("stroke","black")
    //    //.attr("opacity",0.6)
    //    .attr("x1",function(d){return d.x1;})
    //    .attr("y1",function(d){return d.y1;})
    //    .attr("x2",function(d){return d.x2;})
    //    .attr("y2",function(d){return d.y2;})
    //    .attr("title",function(d){return "Source: "+d.start+" Action: "+d.end;})
    //    //aggiungo l'info da chi parte a chi arriva
    //    .attr("start",function(d){return d.start;})
    //    .attr("end",function(d){return d.end;});
        //.on("click",function(){
        //    selected_link=this;
        //    d3.select(this).attr("stroke","red");
        //});
    updateView();
    updateTooltips();

}
function saveNewEp(){

    var ep = updateEP();
    if(validateNewEndPoint(ep)==true){
        $('#FormEP').modal('hide');
        setKeysWindowListener();
        EP_list.forEach(function(ele,index){
            if(parseInt(ele.id) == parseInt(ep.id)){
                //ele.name = ep.name;
                //ele = ep;
                EP_list[index]=ep;                
                console.log("trovato");
                console.log(ele);
            }
        });


    }

    console.log(validateNewEndPoint(ep));

}

function saveNewVNF(){
    var vnf = updateVNF();
    NF_list.forEach(function(ele,index){
        if(parseInt(ele.id) == parseInt(vnf.id)){
            NF_list[index]=vnf;
            console.log(ele);
        }
    })
}



//function drawLINEMenu(){
//    var link=svg_menu.append("g");
//    link.append("rect")
//        .attr("x",650)
//        .attr("y",25)
//        .attr("width",250)
//        .attr("height",30)
//        .attr("fill","#EEE")
//        .attr("stroke","#EEE");
//
//    link.append("line")
//            .attr("class","line_menu")
//            .attr("stroke","black")
//            .attr("x1",700)
//            .attr("y1",40)
//            .attr("x2",850)
//            .attr("y2",40);
//
//    link.append("circle")
//            .attr("r",5)
//            .attr("cx",700)
//            .attr("cy",40);
//
//    link.append("circle")
//            .attr("r",5)
//            .attr("cx",850)
//            .attr("cy",40);
//
//    link.on("click",function(){
//        $("#my_canvas").css("cursor","crosshair");
//        ele1_selected=undefined;
//        ele2_selected=undefined;
//        creating_link=true;
//
//    });
//
//}


function onClickDrawEP(){

        $('#FormEP').modal('show');
        unSetKeysWindowListener();
        $('#seltypeEP' ).val('internal');
        /*reset*/
        resetFormEp();
        $("#idEndPoint").val(NextIdEP());

        $("#saveEP").attr("onclick","drawNewEP()");
        $("#saveEP").html("Add End Point");
}

function onClickDrawVNF(){

    $('#FormNF').modal('show');
    unSetKeysWindowListener();
    $('#seltemplateVNF' ).val('Firewall');

    $("#idVNF").val(NextIdVNF());
    $("#saveVNF").attr("onclick","drawNewNF()");
    $("#saveVNF").html("Add VNF");
    $('#seltemplateVNF').removeAttr('disabled');

    /* Template di default Firewall */
    $.ajax({ type: "GET",url: "/nfg/ajax_template_request/firewall/",
        success: function(data) {FuncSuccess(data);} });

}

function onClickDrawLink(){
    $('#newLinkButton').attr("class","btn btn-warning btn-lg drawButton");
    $("#my_canvas").css("cursor","crosshair");
    ele1_selected=undefined;
    ele2_selected=undefined;
    creating_link=true;

}