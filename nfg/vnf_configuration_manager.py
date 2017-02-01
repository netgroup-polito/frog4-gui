import json
import requests


class VNFConfigurationManager:
    def __init__(self, host, port):
        self.un_protocol = 'http'
        self.un_host = host
        self.un_port = port
        self.base_path = ''

    def get_vnf_state(self, tenant_id, graph_id, vnf_identifier):
        # here a control on the input parameter should be done
        headers = {'Content-type': 'application/json'}
        path = "config/status/" + vnf_identifier + '/' + graph_id + '/' + tenant_id + '/'
        response = requests.get(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + path, headers=headers)
        if response.status_code == 200:
            # t=json.loads(response.content)["list"]
            return {"status": response.status_code,
                    "state": json.loads(response.content)}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}

    def put_vnf_updated_state(self, tenant_id, graph_id, vnf_identifier, data, token):
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        path = "config/vnf/" + vnf_identifier + '/' + graph_id + '/' + tenant_id + '/'
        response = requests.put(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + path, data=data,
            headers=headers)
        print(response)
        if response.status_code == 200:
            return {"status": response.status_code}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}
