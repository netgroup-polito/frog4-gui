function drawEPMenu(){
    //console.log("ciao");

    svg_menu.append("circle")
            .attr("class","end-points")
            //.attr("id",function(d){return "endpoint:"+d.id;})
            .attr("r",r_endpoint)
            .attr("cx",200)
            .attr("cy",40)
            .on("click",function(){
               
                    $('#FormEP').modal('show');
                    $('#seltypeEP' ).val('internal');
                    /*reset*/
                    resetFormEp();
                    $("#idEndPoint").val(NextIdEP());

                    $("#saveEP").attr("onclick","drawNewEP()");
                    $("#saveEP").html("Add End Point");

                
            })
}

function drawNFMenu(){
    svg_menu.append("rect")
            .attr("class","nf")
            .attr("x",400)
            .attr("y",20)
            .attr("width",NF_width)
            .attr("height",NF_height)   
            .on("click",function(){                
                $('#FormNF').modal('show');
                $('#seltemplateVNF' ).val('Firewall');

                /* Template di default Firewall */
                $.ajax({ type: "GET",url: "/nfg/ajax_template_request/firewall/",
                         success: function(data) {FuncSuccess(data);} });

            });}


function drawNewEP(){
    var ele=[];


    var ep = fillNewEP();
    console.log(validateNewEndPoint(ep));
    if(validateNewEndPoint(ep)==true){

        $('#FormEP').modal('hide');

        ele.push(ep);
        EP_list.push(ele[0]);



        svg.selectAll(".new_endpoint")
               
               .data(ele)
               .enter()
               .append("circle")           
               .attr("class","end-points")
               .attr("id",function(d){return d.id;})
               .attr("r",r_endpoint)
           
                .attr("cx",function(d){return d.x;})
                .attr("cy",function(d){return d.y;})
                .on("click",function(d){
                   
                    d3.selectAll(".end-points-select").attr("class","end-points");
                    d3.selectAll(".use_NF").attr("xlink:href","#NF_node");
                    d3.selectAll(".use_BIG").attr("xlink:href","#BIG_SWITCH_node");
                    d3.select(this).attr("class","end-points-select")
                
                    
                    var ep = getEndPointById(d.id);
                    drawEndPointInfo(ep,d.id);  
                })
                .call(drag_EP);
    }else{
        console.log("validazione fallita");
    }
}

function saveNewEp(){
    
    var ep = updateEP();
    if(validateNewEndPoint(ep)==true){
        $('#FormEP').modal('hide');
        EP_list.forEach(function(ele){
            if(parseInt(ele.id) == parseInt(ep.id)){
                //ele.name = ep.name;
                //ele = ep;
                EP_list.push(ep);
                console.log("trovato");
                console.log(ele);
            }
        });

        
    }

    console.log(validateNewEndPoint(ep));

}

function drawNewNF(){
    var ele = [];

            var vnf = fillNewVNF();
            ele.push(vnf);
            NF_list.push(ele[0]);

            console.log(ele);

        svg.selectAll(".NewNetworkFunction")
            .data(ele)
            .enter()
            .append("use").attr("xlink:href", "#NF_node")
            .attr("id", function(d){return d.id;})
            .attr("class", "NetworkFunction") //ogni NF ha un NF_node centrale e attorno tutte le interfacce
        //group[index]
            .attr("x",function(d){return d.x;})
            .attr("y",function(d){return d.y;})
            //.attr("transform","translate("+NF_list[index].x+","+NF_list[index].y+")")
            .call(drag_NF)
            .on("click",function(d){ //da sistemare!
                console.log(this);
            /* funzioni per selezionare questo oggetto e deselezionare gli altri */
                d3.selectAll(".end-points-select").attr("class","end-points");
                //d3.selectAll(".BigSwitch").attr("xlink:href","#BIG_SWITCH_node");
                d3.selectAll(".NetworkFunction").attr("xlink:href","#NF_node");
                $(this).attr("href","#NF_select");
               // d3.select(d).attr("xlink:href","#NF_select");
                /* funzioni per visualizzare le informazioni sulla sinistra */
                var vnf = getVNFById(d.id);
                drawVNFInfo(vnf,d.id);
             });


           
        svg.selectAll(".new_interface")
            .data(ele[0].ports)
            .enter()
            .append("circle")
            .attr("class","interface")
            .attr("cx",function(d){return parseInt(d.x)+parseInt(d.parent_NF_x);})
            .attr("cy",function(d){return parseInt(d.y)+parseInt(d.parent_NF_y);})
            .attr("r",r_interface)
            .attr("parent_NF_position_x",function(d){return d.parent_NF_x;})
            .attr("parent_NF_position_y",function(d){return d.parent_NF_y;})
            .attr("parent",function(d){return "vnf"+d.parent_NF_id;})
            .attr("id",function(d){return "vnf:"+ d.parent_NF_id+":"+d.id;})
            .call(drag_INTERFACE);

}

function drawLINEMenu(){
    var link=svg_menu.append("g");
    link.append("rect")
        .attr("x",650)
        .attr("y",25)
        .attr("width",250)
        .attr("height",30)
        .attr("fill","#EEE")
        .attr("stroke","#EEE");

    link.append("line")
            .attr("class","line_menu")
            .attr("stroke","black") 
            .attr("x1",700)
            .attr("y1",40)
            .attr("x2",850)
            .attr("y2",40);

    link.append("circle")
            .attr("r",5)
            .attr("cx",700)
            .attr("cy",40);

    link.append("circle")
            .attr("r",5)
            .attr("cx",850)
            .attr("cy",40);

    link.on("click",function(){
        $("#my_canvas").css("cursor","crosshair");
        ele1_selected=undefined;
        ele2_selected=undefined;
        creating_link=true;
        
    });

}


