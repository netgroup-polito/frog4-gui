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

