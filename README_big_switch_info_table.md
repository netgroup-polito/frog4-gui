For modify the view of big switch info table, you must edit the the flow_rule_table.json in [nfg/flow_rule_table.json]. This is an configuration file where you can  add or remove columns of  big switch info table.  This file fallows the [nfg/nffg_library/schema.json] file, to visualize one column you must add one of properties of “big-switch” [“flow-rules”].
<br />For example: given a configuration file:

```json
{
  "properties": {
    "id": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "priority": {
      "type": "integer"
    },
    "match": {
      "properties": {
        "protocol": {
          "type": "string"
        },
        "dest_port": {
          "type": "string"
        },
        "port_in": {
          "type": "string"
        }
      }
    },
    "actions": {
      "properties": {
        "output": {
          "type": "string"
        }
      }
    }
  }
}
```



<br />For delete a column match:dest_port you must delete "dest_port": {"type": "string"} from json.
<br /> The result is:
```json
   {
  "properties": {
    "id": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "priority": {
      "type": "integer"
    },
    "match": {
      "properties": {
	
	"protocol": {
          "type": "string"
        },
	"port_in": {
          "type": "string"
        }
        
      }
    },
    "actions": {
      "properties": {
        "output": {
          "type": "string"
        }
      }
    }
  }
}

```

<br />For add another column to table you (for examle actions:push_vlan) you must add “push_vlan”:{“type”:”string”} to actions. 
<br />The result is:
```json
   {
  "properties": {
    "id": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "priority": {
      "type": "integer"
    },
    "match": {
      "properties": {
	
	"protocol": {
          "type": "string"
        },
	"port_in": {
          "type": "string"
        }
        
      }
    },
    "actions": {
      "properties": {
        "output": {
          "type": "string"
        },
	"push_vlan": {
          "type": "string"
        }
      }
    }
  }
}
```


