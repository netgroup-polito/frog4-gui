/*message info from the server */

function deploy_server_message(e){
       
    if(e.success){
        $("#ModalMsgServer").modal("show");
        $("#msg").empty();
        $("#msg").append("<b>"+e.success+"</b>");
        if(e.text) $("#msg").append("<p>"+e.text+"</p>");
        $("#titleWarning").empty();
        $("#titleWarning").html('<span class="glyphicon glyphicon-ok-circle"></span> Message Info');
    }else if(e.err){
        $("#ModalMsgServer").modal("show");
        $("#msg").empty();
        $("#msg").append("<b>"+e.err+"</b>");
        if(e.text) $("#msg").append("<p>"+e.text+"</p>");
        $("#titleWarning").empty();
        $("#titleWarning").html('<span class="glyphicon glyphicon-alert"></span> Warning');
    }
}

function deploy(){
	console.log("---Deploy---");
	file_content_fg = JSON.stringify(original_fg);
	console.log(file_content_fg);
	
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

        /* It views message from server */
        deploy_server_message(e);
        
    }).fail(function(){
        console.log("An error occurred, the files couldn't be sent!");
    });  
	
}

