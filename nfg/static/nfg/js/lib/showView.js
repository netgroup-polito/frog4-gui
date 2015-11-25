/**
 * Created by pc asus on 25/11/2015.
 */
function showNFFG(nf_view){
    if(nf_view==false){
        $(".use_BIG,.BS_interface,.BS_line").hide();
        $(".line").show();
    }else{
        $(".use_BIG,.BS_interface,.BS_line").show();
        $(".line").hide();
    }
}