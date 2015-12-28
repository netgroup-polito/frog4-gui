/* 
*   This file contain the functions to manage to open 
*   json file from the client and preview of json file     
*
*
*/




function showUploadFG(){
    $('#UploadFG').modal('show');
    $('#file_content_upload').hide();                       
}

/* this function shows a preview of the forwarding-graph */

function PreviewFileUpload(){

    var file_name = $('#inputFile').val();

    if(file_name === "" || file_name === null || file_name === undefined){
        $('#file_content_upload').show();
        $('#file_content_upload').empty();
        $('#file_content_upload').append("No file selected");
        return;
    }
                
    var files = document.getElementById('inputFile').files;
    var file = files[0];
                
    var reader = new FileReader();
    var start = 0;
   	var stop = file.size - 1;
    reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            console.log(evt.target.result); 
            var stringa = evt.target.result;
                            
            stringa = stringa.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
            stringa = stringa.replace(/ /g, '&nbsp;');
            stringa = stringa.replace(/(\r\n|\n\r|\r|\n)/g, "<br>"); 

           

            console.log(stringa);
            
                $('#file_content_upload').show();
                $('#file_content_upload').empty();
                $('#file_content_upload').append(stringa);
                             
        }
    };
    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
}

/* This function opens a file from client and it sends his content
   on the server. 
*/

function UploadFile(){
    console.log("Upload Ajax");

    var stringa;
    var file_name = $('#inputFile').val();
        if(file_name === "" || file_name === null || file_name === undefined){
            var err_msg = {};
            err_msg["err"] = "No file selected";
            showMessageServer(err_msg);
            return;
        }
        file_name = file_name.replace("C:\\fakepath\\","");

    var files = document.getElementById('inputFile').files;
    var file = files[0];

    var reader = new FileReader();
    var start = 0;
    var stop = file.size - 1;
    reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) {

            stringa = evt.target.result;
            console.log(stringa);
            console.log(file_name);

            $.ajax({

                /* request view ajax_upload_request from server */
                url: 'ajax_upload_request/', 
                type: 'POST',
                data: { "file_name_fg":file_name,
                        "file_content_fg": stringa} // file inputs.


            }).done(function(e){
                e=JSON.parse(e);
                console.log(e);

                /* It views message from server */
                showMessageServer(e);
            
            }).fail(function(){
                
                console.log("An error occurred, the files couldn't be sent!");
            });  
        }
    };
    
    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);

}

