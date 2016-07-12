/* Variabili globali */
var svg_width = 960,
    svg_width_p = "100%",
    svg_height = 510,
    svg_width_menu = 960,
    svg_width_menu_p = "100%",
    svg_height_menu = 100,
    NF_width=150,
    NF_height=60,
    NF_offset_x=0,
    NF_offset_y=0,
    r_interface=8,
    r_endpoint=22,
    r_endpoint_draw=10,
    BIG_SWITCH_width=200,
    BIG_SWITCH_height=130;


/*
 * main canvas sections:
 */
var svg,
    defs_section,
    VNF_section,
    interfaces_section,
    lines_section,
    bs_section;
var svg_menu;

/* vettore NF */
var NF_list=[];

var EP_list=[];

var big_switch;
var flow_rules=[];
var bs_links=[];

var drag_NF;
var drag_EP;
var drag_INTERFACE;
var drag_INTERFACEBIGSWITCH;
var drag_BIGSWITCH;
var drag_TEXT;

var fg;
var fg_pos;
var file_name_fg;
var template_js;

// only respond once per keydown
var lastKeyDown = -1;

var ele1_selected;
var ele2_selected;
var creating_link=false;
/*
 * global variable that says if in the forwarding graph there is a split
 * if it is set to true -> need to view with big switch
 */
var isSplitted=false;
var BS_view=false;
var isAlreadyPositioned=false;
var isModified=false;


var isReduced = false;

/*
 * selected elements for deleting
 */
var selected_node, selected_link;
var num = 0;

var vnfTemplateList;
var userGraphsRepository;

var epTemplateList;
var currentEP;
var editRuleMatch;
var editRuleAction;
var infoRule;


/* main */


//request for endpoint templates ---- and get $ref from schema
 $.ajax({
             url: 'view_ep_request/',
              type: 'GET'
              }).done(function(data1){
                    var array=new Array();
                    var schema=JSON.parse(data1);
                    var obj=schema['properties']['forwarding-graph']['properties']['end-points']['items']['properties'];
                    for( var t in obj){
                        if(obj[t].hasOwnProperty("$ref")){
                            var str=obj[t]['$ref'];
                            var path=str.split("/");
                            if(schema[path[1]][path[2]]!=undefined)
                                var o=schema[path[1]][path[2]];
                                o.type=t;
                               array.push(o);

                        }
                    }
                    epTemplateList=array;
                    console.log(epTemplateList);
                 });

//request for match & action

$.ajax({
      			  url: 'view_templates_request/',
     	       	          type: 'GET'
                          }).done(function(data){

                            $.ajax({
      			                     url: 'view_match_request/',
                                      type: 'GET'
                                      }).done(function(data1){
                                            editRuleMatch=JSON.parse(data1);
                                            console.log(editRuleMatch);

   					                     });
                            $.ajax({
      			                     url: 'view_action_request/',
                                      type: 'GET'
                                      }).done(function(data1){
                                            editRuleAction=JSON.parse(data1);
                                            console.log(editRuleAction);

   					                     });
                    var t=JSON.parse(data);
                    infoRule=t["properties"];
   					 });




//request for vnf tamplates



$(document).ready(function(){

    $("#draw_menu").hide();
    $("#file_content").hide();
    /* Richiesta Json */
    $.ajax({ type: "GET",url: "/ajax_data_request",
      success: function(data) {
          console.log(data);
          data = data.replace(/'/g,'"');
          /* definisco oggetto fg */
          var json_data=JSON.parse(data);
          var json_data1=JSON.parse(data);

          fg = json_data["json_file_fg"];
          original_fg = json_data1["json_file_fg"];

          if(fg == undefined){
              console.log("clicca qui per disegnaro un nuovo grafo");
          }else{
            console.log(fg["forwarding-graph"]["id"]);
            drawLabelIdFG();
            if(json_data["is_find_pos"]==="true"){
              /* file di posizionamento presente */
              isAlreadyPositioned = true;
              fg_pos = json_data["json_file_pos"];
              console.log("file di posizionamento");
              console.log(fg_pos);
            }else{
              /* file di posizionamento non presente */
              isAlreadyPositioned = false;
            }

            DrawForwardingGraph(fg);
              showBSView(false);
          }
          drawAnyItems();
          file_name_fg = json_data["file_name_fg"];
          $("#nameFile").val(file_name_fg);
          console.log(file_name_fg);
      }
    });
});




$(document).ready(function() {
    $('#my-checkbox').bootstrapToggle();

    $('#my-checkbox').change(function() {
      console.log('Toggle: ' + $(this).prop('checked'));
    })
});





function DrawForwardingGraph(fg){
    /*--->>>DA FARE<<<---
     *controllo degli oggetti se sono undefined occorre vedere lo schema per capire quale campo può non essere presente!
     */
    svg = d3.select("#my_canvas").append("svg").attr("width", svg_width_p).attr("height", svg_height);

    /*
     * svg now is divided in 3 sections
     */
    bs_section=svg.append("g").attr("class","bs_section");
    defs_section=svg.append("g").attr("class","defs_section");
    VNF_section=svg.append("g").attr("class","VNF_section");

    VNF_text_section = svg.append("g").attr("class","VNF_text_section");
    
    lines_section=svg.append("g").attr("class","lines_section");
    interfaces_section=svg.append("g").attr("class","interfaces_section");
    /*
     * defined the main fields of the forwarding graph
     */

    if(fg["forwarding-graph"]["VNFs"]=== undefined){
      console.log("vettore dei vnf non presente nel fg ...");
      console.log("lo definisco vuoto");
      fg["forwarding-graph"]["VNFs"] = [];
    }

    if(fg["forwarding-graph"]["end-points"]=== undefined){
      console.log("vettore degli end-points non presente nel fg ... ");
      console.log("lo definisco vuoto");
      fg["forwarding-graph"]["end-points"] = [];
    }

    if(fg["forwarding-graph"]["big-switch"] === undefined){
      console.log("oggetto big switch non presente nel fg ...");
      console.log("lo definisco vuoto");
      fg["forwarding-graph"]["big-switch"] = {};
      fg["forwarding-graph"]["big-switch"]["flow_rules"] = [];
    }

    NF_list = fg["forwarding-graph"]["VNFs"];
    EP_list = fg["forwarding-graph"]["end-points"];
    big_switch = fg["forwarding-graph"]["big-switch"];
    flow_rules = fg["forwarding-graph"]["big-switch"]["flow-rules"];

    /* chiamo la funzione per settare il posizionamento iniziale (ancora non prevede end point e big switch) */
    FG_init();

    //se variabile gloabale è bigswitch cambio

    //getVNFById("00000001");
    /*
    in drag.js
     */
    drag_NF = dragNF();
    drag_EP = dragEP();
    drag_INTERFACE = dragINTERFACE();
    drag_INTERFACEBIGSWITCH = dragINTERFACEBIGSWITCH();
    drag_BIGSWITCH=dragBIGSWITCH();
    //drag_TEXT = dragTEXT();
    /*
     * Defining of keyBindings
     */

    setKeysWindowListener();
    /*
    in defElements
     */
    var NF = defNF();
    var NF_select = defNF_select();
    var BIG_SWITCH = defBIGSWITCH();
    var BIG_SWITCH_select = defBIGSWITCH_select();
    var IMG_PC_RED = defImgPcRed();
    var IMG_PC_BLUE = defImgPcBlue();
    var IMG_INTERNET_RED = defImgInternetRed();
    var IMG_INTERNET_BLUE = defImgInternetBlue();
    
    defArrow();

    /*
    in drawElements.js
     */

    drawNF(NF_list);
    drawNF_text(NF_list);
    drawLINE(flow_rules);
    drawBSLinks(bs_links);

    var interfaces=[];
    NF_list.forEach(function(d){d.ports.forEach(function(e){interfaces.push(e)});});

    drawVNF_interfaces(interfaces);
    drawEP(EP_list);
    drawBIGSWITCH();
    drawBSInterfaces(big_switch.interfaces);

    checkSplit();
    setPointerAtLines();
    updateTooltips();

}


