/* In this file thre are all functions to manage 
   the VNF form */ 




function addFormPort(){
     $("#infoPort").empty();
	console.log(template_js);
	var port_template = template_js.ports;

            $html = '<div class="boxPort">'+
                    '    <div class="form-group">'+
                    '        <label class="control-label col-sm-2" for="title" id="titleInterface"><a>Ports info:</a></label>'+     
                    '        <div class="col-sm-10">'+
                    '    </div>'+          
                    '</div>';
          
                    port_template.forEach(function(port_t){
                    	console.log(port_t);
                    	$html +='<div class="form-group" >'+
                    				'<label class="control-label col-sm-2" for="typeInterface" >Label: '+port_t.label+'</label>'+
                						'<div class="col-sm-10">'+
                            				'<select class="form-control" name="MInMax" id="MinMax'+port_t.label+'">';

                            					var split = port_t.position.split("-");
                            					var p_num = parseInt(split[0]);
                    							var s_num = parseInt(split[1]);

                    							if(s_num == 'N'){s_num = 63;}
                    							console.log(s_num,p_num,s_num-p_num);

                    							for(var i=parseInt(port_t.min);i<=parseInt(port_t.min)+(s_num-p_num);i++){
                                                    if(i===parseInt(port_t.min)){
                                                        $html+= '<option selected>'+i+'</option>';
                                                    }else{
                                                        $html+= '<option>'+i+'</option>';
                                                    }
                    								
                    							}                                				
                            				$html +='</select>'+
                        				'</div>'+
                    			'</div>';                    				
                   		});
                    
            $html+= '</div>'+
                    '</div>'+
                    '</div>';

                $("#infoPort").append($html);
            }



function fillInTemplate(templName) {
    var $html='';
    $("#infoTemplate").empty();

    var obj;
    var templ;
    for(var j=0; j<vnfTemplateList.length; j++)
            if(vnfTemplateList[j].template.name===templName){
                obj=vnfTemplateList[j];
                template_js=obj.template;
                templ=obj.template
            }

    $("#idVNF").val(obj.id);//set a id
    $("#nameVNF").val(obj.template.name);//set a nameVNF
    
    for (var t in templ){
        $html+='<div class="form-group">'+
                            '<label class="control-label col-sm-2" for="expandable">'+t+":"+'</label>'+
                            '<div class="col-sm-10">'+
                                '<input type="text" name="idVNF" class="form-control " id="id'+t+'" placeholder="'+templ[t]+'" disabled>'+
                            '</div>'+
                        '</div>';
    }

     $("#infoTemplate").append($html);

    addFormPort();

    
}

function addVNFModalInfo() {



    $('#selectMenu').empty();
    var $html = '<select class="form-control" name="type" id="seltemplateVNF" onchange="fillInTemplate(this.value)">';



    for(var i=0; i<vnfTemplateList.length; i++){
        var obj = vnfTemplateList[i].template;

        for(var temp in obj)
        console.log(obj[temp]);
        if(i==0){
            $html+='<option selected>'+obj.name+'</option>';
            console.log(obj.name);
            template_js=obj;
            fillInTemplate(obj.name);
        }
        else
        $html+='<option>'+obj.name+'</option>';
        console.log(obj.name);

    }
     $html+='</select>';


    $('#selectMenu').append($html);



}





function FuncSuccess(data){

    console.log(data);

    vnfTemplateList=JSON.parse(data);
    console.log(templateList);
    $('#infoPort').empty();
    addVNFModalInfo();

}

function showEditInfoVNF(idVNF){
    $('#FormNF').modal('show');
    unSetKeysWindowListener();
    console.log("hhhhh"+idVNF);
    FillFormEditVNF(idVNF);
    
}

function showInfoVNF() {
        $("#infoTemplate").slideToggle("slow");
    }



