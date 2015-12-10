function showDownloadFG(){
    $('#DownloadFG').modal('show');
    $("#file_content_download").hide();            
    //$(".form-control").val(""); 
    ajaxFilesRequest();
}

function hideDownloadFG(){
    $('#DownloadFG').modal('hide');
}



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
    file_list = JSON.parse(data);
    $("#selfileDownload").empty();
    for(var i=0;i<file_list.length;i++){
        $("#selfileDownload").append("<option>"+file_list[i]+"</option>");
    }
}

function PreviewFileDownload(){                
    
    var file;
    var stringa;
    var file_name = $("#selfileDownload").val();
    console.log(file_name);

    $.ajax({
        url: 'ajax_download_preview/', 
        type: 'POST',
        data: { "file_name_fg":file_name} // file inputs.

    }).done(function(e){
                                
        console.log("Success: Files sent!");
        console.log(e);
        /*file restituito */
        stringa = e;
        
        $('#file_content_download').show();
        $('#file_content_download').empty();
        $('#file_content_download').append(stringa);
            
    }).fail(function(){
                
        console.log("An error occurred, the files couldn't be sent!");
    });      
}

function DownloadFile(){
    console.log("Download Ajax");

    var file;
    var stringa;
    var file_name = $("#selfileDownload").val();
    console.log(file_name);

    $.ajax({
        url: 'ajax_download_request/', 
        type: 'POST',
        data: { "file_name_fg":file_name} // file inputs.

    }).done(function(e){
                                
        console.log("Success: Files sent!");
        console.log(e);
        /*file restituito */
        hideDownloadFG();
        $("#ModalMsgServer").modal("show");
        $("#msg").empty();
        $("#msg").append("<b>"+e+"</b>");
        //location.reload();
            
    }).fail(function(){
                
        console.log("An error occurred, the files couldn't be sent!");
    });      

}
