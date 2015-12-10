function showUploadFG(){
    $('#UploadFG').modal('show');
    $('#file_content_upload').hide();            
    //$('.form-control').val('');                
}

function PreviewFileUpload(){
                
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

            //console.log(stringa);
            
                $('#file_content_upload').show();
                $('#file_content_upload').empty();
                $('#file_content_upload').append(stringa);
                             
        }
    };
    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
}

function UploadFile(){
    console.log("Upload Ajax");

    var stringa;
    var file_name = $('#inputFile').val();
        file_name = file_name.replace("C:\\fakepath\\","");

    var files = document.getElementById('inputFile').files;
    var file = files[0];

    var reader = new FileReader();
    var start = 0;
    var stop = file.size - 1;
    reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            //console.log(evt.target.result); 
            stringa = evt.target.result;
            console.log(stringa);
            console.log(file_name);

            $.ajax({

                url: 'ajax_upload_request/', 
                type: 'POST',
                data: { "file_name_fg":file_name,
                        "file_content_fg": stringa} // file inputs.


            }).done(function(e){
                                
                console.log("Success: Files sent!");
                location.reload();
            
            }).fail(function(){
                
                console.log("An error occurred, the files couldn't be sent!");
            });  
        }
    };
    
    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);

}

