/**
 * Contains the functions for serialize and parse the js objects
 */


//return a string in the format of the JSON file...
function POS_serialize(){
    var file={};
    file.poisition_tree=fg.id;
    file.VNFs=[];
    if(NF_list.length!=0){
        NF_list.forEach(function(nf,i){
            file.VNFs[i]={id:nf.id,x:nf.x,y:nf.y};
            file.VNFs[i].ports=[];
            nf.ports.forEach(function(port,j){
                file.VNFs[i].ports[j]={id:port.id,x:port.x,y:port.y};
            });
        });
    }
    if(EP_list.length!=0){
        file["end-points"]=[];
        EP_list.forEach(function(ep,i){
            file["end-points"][i]={id:ep.id,x:ep.x,y:ep.y};
        });
    }
    if(big_switch!=undefined){
        file["big_switch"]={x:big_switch.x,y:big_switch.y};
        //salvare anche un vettore di posizione per le interfacce del bs... con id dell'interfaccia corrispondente + x + y
    }
    return JSON.stringify(file);
}

function FG_serialize(){

}
function parse(){

}