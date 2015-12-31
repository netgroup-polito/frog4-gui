function deploy(){
	console.log("---Deploy---");

	var file_content_fg = serialize_fg();

	$.ajax({
	 	/* ajax request */
        url: 'deploy/', 
        type: 'POST',
        data: { 			
            "file_content_fg": file_content_fg,		/*json file_fg */
        } 

    }).done(function(e){
        console.log("Success: Files sent!");    
        e=JSON.parse(e);
        console.log(e);

        /* It views message from server */
        showMessageServer(e);
        location.reload();
        
    }).fail(function(){
        console.log("An error occurred, the files couldn't be sent!");
    });  
}