/* In this file there are all functions to manage 
   the Preview form */ 


function showPreviewFG(){
    $('#PreviewFG').modal('show');
    previewFile();
}

function previewFile(){
    my_fg = ser_fg();
    console.log(my_fg);
    stringa = JSON.stringify(my_fg);
    $('#file_content_preview').show();
    $('#file_content_preview').empty();
    $('#file_content_preview').append(stringa);

}

