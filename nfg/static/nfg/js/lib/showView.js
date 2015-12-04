/**
 * Created by pc asus on 25/11/2015.
 */
function showNFFG(bs_view){
    if(bs_view===false && isSplitted===true){
        console.log("errore!");
    }
    if(bs_view===false && isSplitted===false){
        NF_view=true;
        $(".use_BIG,.BS_interface,.BS_line").hide();
        $(".line").show();
        $(".info").empty();        
    }else{
        NF_view=false;
        $(".use_BIG,.BS_interface,.BS_line").show();
        $(".line").hide();
       	
    }
}