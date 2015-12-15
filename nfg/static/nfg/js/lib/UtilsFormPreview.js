function showPreviewFG(){
    $('#PreviewFG').modal('show');
    previewFile();
}


/*function previewFile(){                
    
    var file;
    var stringa;
    var file_name = fg["forwarding-graph"].id+".json";
    console.log(file_name);

    $.ajax({
        url: 'ajax_download_preview/', 
        type: 'POST',
        data: { "file_name_fg":file_name} // file inputs.

    }).done(function(e){
                                
        console.log("Success: Files sent!");
        console.log(e);
        
        stringa = e;
        
        $('#file_content_preview').show();
        $('#file_content_preview').empty();
        $('#file_content_preview').append(stringa);
            
    }).fail(function(){
                
        console.log("An error occurred, the files couldn't be sent!");
    });      
}*/

function previewFile(){
    my_fg = ser_fg();
    console.log(my_fg);
    stringa = JSON.stringify(my_fg);
    $('#file_content_preview').show();
    $('#file_content_preview').empty();
    $('#file_content_preview').append(stringa);

}

function SelectText(element) {
    var doc = document
        , text = doc.getElementById(element)
        , range, selection
    ;    
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function copyOnClipboard(){
	
	SelectText('file_content_preview');
}

