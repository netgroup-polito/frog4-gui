# Supported features from the configuration of the VNFs modal

* ##### depicting VNF configuration modal starting from YANG MODEL of a VNF and optionally its STATE 

    Making a GET request to the server I can have two cases:
	* ```jsoned_yang_model``` + ```json_state```: DOM HTML(input text, optional input, ...) created from jsoned_yang_model and then filled with the content of the json_state
	* ```jsoned_yang_model``` + ```undefined state``` -> same as before but this time, the state is created as the GUI is depicted.
    
    Note: the ```jsoned_yang_model``` is the JSON version of a YANG model created by the server that handles VNF models.

    Once loaded the model and optionally the state in two scope variable, the modal is then opened and depicted exploiting angular directives. In other words, each YANG statement is modeled with an angular directive.

	The configuration state changes modifying the input values on the graphic interface thanks to the 2-way binding of angular.

	E.g. YANG model:
	```
	container interfaces { 
		list ifEntry { 
			key "name"; 
			leaf name { 
				type string; 
			} 
			leaf configurationType { 
				type enumeration { 
					enum dhcp; 
					enum static;
					enum not_defined;
				} 
			}
		} 
	}
	```

	It is parsed with the following angular directive:

	```<container model-obj="containerModel" state-obj="containerState">```
	it handles the content of a container
	
	```<list model-obj="listModel" state-obj="listState">```
	it handles the content of a list
	
	```<leaf model-obj="leafModel" state-obj="leafState">```
	it handles the content of a leaf

	Information of both model and state are passed to the tag in order to correctly handle the statement.
	In the case of an 'undefined' state, this is automatically created by the gui.

	E.g.
	The ```list``` statement needs to handle a list of leaves, so every time I define a list tag, I automatically generate a list of leaves.
	Same behavior for the ```leaf``` where according to the type of leaf: string, enumeration, ip-address; it generates either an input text or an optional input.

	In general, the supported YANG statements are:
	* container
	* list
	* leaf
	* augment

    Types of leaf:
	* string
	* enumeration
	* inet:ip-address
	* inet:ipv4-address
	* leafref (not supported)

* ##### loading a state configuration from FileSystem
    
    Once loaded the JSON state file, the state variable is then redefined and so, thanks again to the 2-ways binding of angular, all the modal is depicted again. 


* ##### additional inner protocol exploiting the description field of YANG
	The description field is used in order to define our protocol. The protocol is based on the keyword which the most important are: read-only (to disable a tag), name (to redefine the name of a container, list, leaf, etc.).


* ##### opening the configuration modal by the gear button on each VNF
	
* ##### support the augment statement of YANG for firewall

    the augment statement is used when we want to conditionally define something according to the value of another statement.
    
    E.g.
    ```
    augment "/interfaces/ifEntry" { 
    	when "configurationType='static'"; 
    	leaf address { 
    		type inet:ip-address; 
    	}
    }
    ```
