/* In this file there are all functions to manage 
   the Download form (Open from server) */


function showDownloadFG(){
    $('#titleJsonLoadRemote').text("Load from UN");
     $('#selfileDownload').empty();
    $("#DownloadClick").attr("onclick","DownloadFile()");
    $('#DownloadFG').modal('show');
    $("#file_content_download").hide();
    ajaxFilesRequest();
}

function hideDownloadFG(){
    $('#DownloadFG').modal('hide');
}



/* This function return a list of files in the database */
function ajaxFilesRequest(){
    $.ajax({
        url: 'ajax_files_request/',
        type: 'GET'
    }).done(function(data){
        console.log(data);
        drawFormDownload(data);
    });
}

function drawFormDownload(data){
    file_list = data["NF-FG"];//JSON.parse(data);
    $("#selfileDownload").empty();
    for(var i=0;i<file_list.length;i++){
        $("#selfileDownload").append("<option>"+file_list[i]["forwarding-graph"].id+" - "+file_list[i]["forwarding-graph"].name+"</option>" );
    }
}

function PreviewFileDownload(data){

    var stringa;
    var file_name = $("#selfileDownload").val();
    var id=file_name.split(" - ");
    console.log(file_name);

    for(var i=0;i<file_list.length;i++)
        if(file_list[i]["forwarding-graph"].id==id[0])
            stringa=JSON.stringify(file_list[i]["forwarding-graph"])




        $('#file_content_download').empty();
        $('#file_content_download').append(stringa);
        $('#file_content_download').show();

}

function DownloadFile(){
    console.log("Download Ajax");

    var file_name = $("#selfileDownload").val().split(" - ")[0];
    console.log(file_name);

    $.ajax({
        url: 'ajax_download_request/',
        type: 'POST',
        data: { "file_name_fg":file_name} // file inputs.

    }).done(function(e){

        console.log("Success: Files sent!");
        console.log(e);
        e=JSON.parse(e);
        /*file restituito */
        hideDownloadFG();
        showMessageServer(e);

        location.reload();

    }).fail(function(){

        console.log("An error occurred, the files couldn't be sent!");
    });

}

function DrawGraph(data){
    $('#my_canvas').empty();


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

function DownloadLocalFile(){
    console.log("Download Ajax");
    //accrocchio
    $("#Upload").attr("onclick","DownloadFile()");


    var file_name = $("#inputFile").val();
    console.log(file_name);

    $.ajax({
        url: 'graph_from_file_request/',
        type: 'POST',
        data: { "file_name_fg_local":file_name} // file inputs.

    }).done(function(data){
        DrawGraph(data);

    }).fail(function(){

        console.log("An error occurred, the files couldn't be sent!");
    });

}

function DownloadRemoteFile(){
    console.log("DDownloadRemoteFile.........");
    var id = $("#selfileDownload").val().split(" - ")[0];
    console.log(id);

    for(var i=0;i<userGraphsRepository.length;i++)
        if(userGraphsRepository[i].file_name_fg==id){
            console.log(id);
            console.log(JSON.stringify(userGraphsRepository[i]))
            DrawGraph(JSON.stringify(userGraphsRepository[i]));
        }

    $('#DownloadFG').modal('toggle');

}
