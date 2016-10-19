Supported features from the configuration of the VNFs modal

* depicting configuration vnf modal starting from YANG MODEL of a vnf and optionally its STATE
	making a GET request to the server I can have two cases:
		§ jsoned_yang_model + json_state -> DOM HTML(input text, optional input, ...) created from jsoned_yang_model and then filled with the content of the json_state
		§ jsoned_yang_model + NO state -> same as before but this time, the state is created as the gui is depicted.

		Once loaded the model and optionally the state in two scope variable, the modal is opened and depicted exploiting angular directive. In other words, each yang statement is modelled with an angular directive.

		The configuration state changes modifying the input values on the graphic interface thanks to the 2-way binding of angular.
		
		E.g.
		yang model:
		'''
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
		'''

		is parsed with the following angular directive:

		<container model-obj="containerModel" state-obj="containerState"> -> it handles the content of a container
		<list model-obj="listModel" state-obj="listState"> -> it handles the content of a list
		<leaf model-obj="leafModel" state-obj="leafState"> -> it handles the content of a leaf

		Information of both model and state are passed to the tag in order to correctly handle the statement.
		In the case of an 'undefined' state, this is automatically created by the gui.

		E.g.
		The list statement needs to handle a list of leaves, so every time I define a "list" tag, I automatically generate a list of leaves.
		Same behaviour for the leaf where according to the type of leaf: string, enumeration, ip; it generates either an input text or an optional input.

		In general, the supported yang statements are:
			* container
			* list
			* leaf

			Types of leaf:
				* string
				* enumeration
				* inet:ip-address
				* inet:ipv4-address

			Furthermore, even the 'augment' statement is supported.(used in the yang model of the firewall).


* loading a state configuration from FileSystem
	Once loaded the json file, the state variable is then redefined and som thanks again to hte 2-ways binding of angular, all the modal is redepicted. 


* additional inner protocol exploiting the description field of YANG
	The descprtion field is used in order to define our protocol. The protocol is based on keyword which the most important are: readonly(it disables an input), name(to redefine the name of a container or list, etc.).


* opening the configuration modal by the gear button on each vnf
	
* support the augment statement of YANG for firewall
	the augment statement is used when we want to conditionally define something according to the values of other statement.
	E.g.
	'''
	augment "/interfaces/ifEntry" { 
		when "configurationType='static'"; 
		leaf address { 
			type inet:ip-address; 
		}
	}
	'''
