import json
import requests

class ModelStateVNFManager:
	def __init__(self, host, port):
		self.un_protocol = 'http'
		self.un_host = host
		self.un_port = port
		self.base_path = ''

	def get_vnf_model(self, vnf_type):
		#here a control on the input parameter should be done
		headers = {'Content-type': 'application/json'}
		path = "status/" + vnf_type;
		response = requests.get(self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + path, headers=headers)
		if response.status_code == 200:
			# t=json.loads(response.content)["list"]
			return {"status": response.status_code,
					"model": json.loads(response.content)}
		else:  # todo: gestione errori comuni
			return {"status": response.status_code, "error": "Unknown Error"}

	def get_vnf_state(self, mac_address, username):
		#here a control on the input parameter should be done
		headers = {'Content-type': 'application/json'}
		path = "configure/" + mac_address + "/user/" + username;
		response = requests.get(self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + path, headers=headers)
		if response.status_code == 200:
			# t=json.loads(response.content)["list"]
			return {"status": response.status_code,
					"state": json.loads(response.content)}
		else:  # todo: gestione errori comuni
			return {"status": response.status_code, "error": "Unknown Error"}

	def put_vnf_updated_state(self, mac_address, username, data):
		headers = {'Content-type': 'application/json'}
		path = "configure/" + mac_address + "/user/" + username;
		response = requests.put(self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + path, data=data, headers=headers)
		print response
		if response.status_code == 200:
			print response
			print response.headers['content-type']
			if response.headers['content-type'] == 'application/token':
				return {"status": response.status_code, "token": response.content}
			else:
				return {"status": response.status_code, "error": "No Token in the Response"}
		else:
			return {"status": response.status_code, "error": "Unknown Error"}