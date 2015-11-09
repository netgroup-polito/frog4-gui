import logging
import json
import requests
import os.path

from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import RequestContext, loader

from django.contrib.auth import authenticate

from nffg_library.nffg import NF_FG

def index(request):
	if "username" not in request.session:
		return HttpResponseRedirect("/nfg/login/")
	else:		
		return render(request,'nfg/index.html',{'username':request.session['username']})

def logout(request):
	if request.method == 'GET':
		if "username" in request.session:
			request.session.flush()
		
		return HttpResponseRedirect("/nfg/login")



def login(request):

	if request.method == 'GET':
		if "username" in request.session:
			return HttpResponseRedirect("/nfg/")
		if request.GET.has_key('err_message'):
			err_msg = request.GET['err_message']
		else:
			err_msg = ''

		return render(request,'nfg/login.html',{'title':'Login','err_message':err_msg})

	elif request.method == 'POST':
		username = request.POST['username']
		password = request.POST['password']

		user = authenticate(username=username,password=password)

		if user is not None:
			request.session['password'] = password
			request.session['username'] = username

			request.session.set_expiry(0)
			

			return HttpResponseRedirect("/nfg/")
		else:
			return HttpResponseRedirect("/nfg/login?err_message=Authentication Error!")


	

def ajax_data_request(request):
	nffg_dict_1 = {
  "forwarding-graph": {
    "id": "00000001",
    "name": "Forwarding graph",
    "VNFs": [
      {
        "vnf_template": "firewall.json",
        "id": "00000001",
        "name": "Firewall",
        "ports": [
          {
            "id": "User:0",
            "name": "User side interface"
          },
          {
            "id": "WAN:0",
            "name": "WAN side interface"
          }
        ]
      },{
        "vnf_template": "switch.json",
        "id": "00000002",
        "name": "Switch",
        "ports": [
          {
            "id": "User:0",
            "name": "User side interface"
          },
          {
            "id": "WAN:0",
            "name": "WAN side interface"
          }
        ]
      }
    ],
    "end-points": [
      {
        "id": "00000001",
        "name": "ingress",
        "type": "interface",
        "interface": {
          "node": "10.0.0.1",
          "interface": "eth0"
        }
      },
      {
        "id": "00000002",
        "name": "egress",
        "type": "interface",
        "interface": {
          "node": "10.0.0.1",
          "interface": "eth1"
        }
      }
    ],
    "big-switch": {
      "flow-rules": [
        {
          "id": "000000001",
          "priority": 1,
          "match": {
            "port_in": "endpoint:00000001"
          },
          "action": {
            "output": "vnf:00000001:User:0"
          }
        },
        {
          "id": "000000002",
          "priority": 1,
          "match": {
            "port_in": "vnf:00000001:User:0"
          },
          "action": {
            "output": "endpoint:00000001"
          }
        },
        {
          "id": "000000003",
          "priority": 1,
          "match": {
            "port_in": "vnf:00000001:WAN:0"
          },
          "action": {
            "output": "endpoint:00000001"
          }
        },
        {
          "id": "000000004",
          "priority": 1,
          "match": {
            "port_in": "endpoint:00000001"
          },
          "action": {
            "output": "vnf:00000001:WAN:0"
          }
        }
      ]
    }
  }
}

	'''nffg_dict_2 = {"forwarding-graph":{"VNFs":[{"ports":[{"id":"L2Port:0","name":"data-lan"},{"id":"L2Port:1","name":"data-lan"},{"id":"L2Port:2","name":"data-lan"},{"id":"L2Port:3","name":"data-lan"}],"vnf_template":"switch.json","id":"00000001","groups":["isp-function"],"name":"switch-data"},{"ports":[{"id":"inout:0","name":"data-port"}],"vnf_template":"dhcp.json","id":"00000002","groups":["isp-function"],"name":"dhcp"},{"ports":[{"id":"inout:0","name":"data-port"}],"vnf_template":"dhcp.json","id":"00000005","groups":["isp-function"],"name":"dhcp"},{"ports":[{"id":"L2Port:0"},{"id":"L2Port:1"}],"vnf_template":"switch.json","id":"00000006","name":"firewall"},{"ports":[{"id":"User:0"}],"vnf_template":"nat.json","id":"00000004","groups":["isp-function"],"name":"router-nat"}],"end-points":[{"interface":{"node":"130.192.225.193","interface":"to-br-usr"},"type":"interface","id":"00000001","name":"ingress"}],"big-switch":{"flow-rules":[{"priority":1,"actions":[{"output":"vnf:00000001:L2Port:0"}],"id":"000000001","match":{"port_in":"endpoint:00000001"}},{"priority":1,"actions":[{"output":"endpoint:00000001"}],"id":"000000002","match":{"port_in":"vnf:00000001:L2Port:0"}},{"priority":1,"actions":[{"output":"vnf:00000001:L2Port:1"}],"id":"000000003","match":{"port_in":"vnf:00000002:inout:0"}},{"priority":1,"actions":[{"output":"vnf:00000002:inout:0"}],"id":"000000004","match":{"port_in":"vnf:00000001:L2Port:1"}},{"priority":1,"actions":[{"output":"vnf:00000001:L2Port:2"}],"id":"000000005","match":{"port_in":"vnf:00000006:L2Port:0"}},{"priority":1,"actions":[{"output":"vnf:00000006:L2Port:0"}],"id":"000000006","match":{"port_in":"vnf:00000001:L2Port:2"}},{"priority":1,"actions":[{"output":"vnf:00000004:User:0"}],"id":"000000007","match":{"port_in":"vnf:00000006:L2Port:1"}},{"priority":1,"actions":[{"output":"vnf:00000006:L2Port:1"}],"id":"000000008","match":{"port_in":"vnf:00000004:User:0"}},{"priority":1,"actions":[{"output":"vnf:00000001:L2Port:3"}],"id":"000000011","match":{"port_in":"vnf:00000005:inout:0"}},{"priority":1,"actions":[{"output":"vnf:00000005:inout:0"}],"id":"000000012","match":{"port_in":"vnf:00000001:L2Port:3"}}]},"id":"00000001","name":"Protected access to the internet"}}

	nffg_1 = NF_FG()
	nffg_1.parseDict(nffg_dict_1)
	nffg_2 = NF_FG()
	nffg_2.parseDict(nffg_dict_2)
	nffg_diff = nffg_1.diff(nffg_2)'''
	
	
	template = loader.get_template('nfg/index2.html')
	context = RequestContext(request)
	
	return HttpResponse("%s" % nffg_dict_1)
	'''return render(request,'nfg/index2.html',nffg_1.getDict(True))'''
