/* Variabili globali */
var svg_width = 960,
    svg_height = 500,
    svg_width_menu = 960,
    svg_height_menu = 80,
    NF_width=120,
    NF_height=50,
    NF_offset_x=0,
    NF_offset_y=0,
    r_interface=8,
    r_endpoint=15,
    BIG_SWITCH_width=200,
    BIG_SWITCH_height=130;

var svg;
var svg_menu;

/* vettore NF */
var NF_list=[];

var EP_list=[];

var big_switch;
var flow_rules;
var bs_links=[];

var drag_NF;
var drag_EP;
var drag_INTERFACE;
var drag_INTERFACEBIGSWITCH;
var drag_BIGSWITCH;
var fg;
var group=[];

/* main */

$(document).ready(function(){

    $("#draw_menu").hide();
    /* Richiesta Json */
    $.ajax({ type: "GET",url: "/nfg/ajax_data_request",
      success: function(data) {
          //console.log(data);
          data = data.replace(/'/g,'"');
          /* definisco oggetto fg */
          fg=JSON.parse(data);
          DrawMenuBar();
          DrawForwardingGraph(fg);
      }
    });
    // fg={
        // "forwarding-graph": {
            // "id": "00000001",
            // "name": "Forwarding graph",
            // "VNFs": [
                // {
                    // "vnf_template": "firewall80.json",
                    // "id": "00000001",
                    // "name": "Web Firewall",
                    // "ports": [
                        // {
                            // "id": "User:0",
                            // "name": "User side interface"
                        // },
                        // {
                            // "id": "WAN:0",
                            // "name": "WAN side interface"
                        // }
                    // ]
                // },
                // {
                    // "vnf_template": "firewall.json",
                    // "id": "00000002",
                    // "name": "Non-Web Firewall",
                    // "ports": [
                        // {
                            // "id": "User:0",
                            // "name": "User side interface"
                        // },
                        // {
                            // "id": "WAN:0",
                            // "name": "WAN side interface"
                        // }
                    // ]
                // }
            // ],
            // "end-points": [
                // {
                    // "id": "00000001",
                    // "name": "ingress",
                    // "type": "interface",
                    // "interface": {
                        // "node": "10.0.0.1",
                        // "interface": "eth0"
                    // }
                // },
                // {
                    // "id": "00000002",
                    // "name": "egress",
                    // "type": "interface",
                    // "interface": {
                        // "node": "10.0.0.1",
                        // "interface": "eth1"
                    // }
                // }
            // ],
            // "big-switch": {
                // "flow-rules": [
                    // {
                        // "id": "000000001",
                        // "priority": 100,
                        // "match": {
                            // "ether_type": "0x0800",
                            // "protocol": "tcp",
                            // "dest_port": "80",
                            // "port_in": "endpoint:00000001"
                        // },
                        // "action": [{
                            // "output": "vnf:00000001:User:0"
                        // }]
                    // },
                    // {
                        // "id": "000000002",
                        // "priority": 1,
                        // "match": {
                            // "port_in": "vnf:00000001:User:0"
                        // },
                        // "action": [{
                            // "output": "endpoint:00000001"
                        // }]
                    // },
                    // {
                        // "id": "000000003",
                        // "priority": 1,
                        // "match": {
                            // "port_in": "endpoint:00000001"
                        // },
                        // "action": [{
                            // "output": "vnf:00000002:User:0"
                        // }]
                    // },
                    // {
                        // "id": "000000004",
                        // "priority": 1,
                        // "match": {
                            // "port_in": "vnf:00000002:User:0"
                        // },
                        // "action": [{
                            // "output": "endpoint:00000001"
                        // }]
                    // },
                    // {
                        // "id": "000000005",
                        // "priority": 1,
                        // "match": {
                            // "port_in": "vnf:00000001:WAN:0"
                        // },
                        // "action": [{
                            // "output": "endpoint:00000002"
                        // }]
                    // },
                    // {
                        // "id": "000000006",
                        // "priority": 1,
                        // "match": {
                            // "port_in": "vnf:00000002:User:0"
                        // },
                        // "action": [{
                            // "output": "endpoint:00000002"
                        // }]
                    // },
                    // {
                        // "id": "000000007",
                        // "priority": 1,
                        // "match": {
                            // "port_in": "endpoint:00000002"
                        // },
                        // "action": [{
                            // "output": "vnf:00000002:User:0"
                        // }]
                    // }
                // ]
            // }
        // }
    // };
    // DrawMenuBar();
    // DrawForwardingGraph(fg);

});

function DrawMenuBar(){
    svg_menu = d3.select("#draw_menu").append("svg").attr("width", svg_width_menu).attr("height", svg_height_menu);
    drawEPMenu();
    drawNFMenu();
    drawLINEMenu();
}


function DrawForwardingGraph(fg){
    /*--->>>DA FARE<<<---
     *controllo degli oggetti se sono undefined occorre vedere lo schema per capire quale campo può non essere presente!
     */
    svg = d3.select("#my_canvas").append("svg").attr("width", svg_width).attr("height", svg_height);
    NF_list = fg["forwarding-graph"]["VNFs"];
    EP_list = fg["forwarding-graph"]["end-points"];
    big_switch = fg["forwarding-graph"]["big-switch"];
    flow_rules = fg["forwarding-graph"]["big-switch"]["flow-rules"];

    /* chiamo la funzione per settare il posizionamento iniziale (ancora non prevede end point e big switch) */
    setInitialNFPositions();
    setInitialEPPositions();
    setInitialBSPositions();
    elaborateFlowRules();

    //getVNFById("00000001");
    /*
    in drag.js
     */
    drag_NF = dragNF();
    drag_EP = dragEP();
    drag_INTERFACE = dragINTERFACE();
    drag_INTERFACEBIGSWITCH = dragINTERFACEBIGSWITCH();
    drag_BIGSWITCH=dragBIGSWITCH();


    /*
    in defElements
     */
    var NF = defNF();
    var NF_select = defNF_select();
    var BIG_SWITCH = defBIGSWITCH();
    var BIG_SWITCH_select = defBIGSWITCH_select();


    //console.log(EP_list);

    /*
    in drawElements.js
     */

    drawNF();
    drawLINE();
    drawBSLinks();
    drawVNF_interfaces();
    drawEP();
    drawBIGSWITCH();

    //window.alert(serialize());

    //rirdianiamo l'html!

    //svg.selectAll(".BS_line,.interface,use").sort(function(a){
    //    console.log(a);
    //    if(a.ref!==undefined) return -5;
    //    if(a.id===undefined) return -1;
    //    return 1;
    //});

    $(".interface").tooltip({
        'container': 'body',
        'placement': 'top'
    });

    $(".line").tooltip({
        'container': 'body',
        'placement': 'top'
    });



}


