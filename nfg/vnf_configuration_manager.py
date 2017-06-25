import json
import requests


class VNFConfigurationManager:
    def __init__(self, config_orch_endpoint):
        self.base_url = config_orch_endpoint

    def get_vnf_state(self, tenant_id, graph_id, vnf_id):
        # here a control on the input parameter should be done
        headers = {'Content-type': 'application/json'}
        get_status_url = self.base_url + '/' + tenant_id + '/' + graph_id + '/' + vnf_id + '/'
        response = requests.get(get_status_url, headers=headers)
        if response.status_code == 200:
            # t=json.loads(response.content)["list"]
            return {"status": response.status_code,
                    "state": json.loads(response.content)}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": json.loads(response.content)}

    def put_vnf_updated_state(self, tenant_id, graph_id, vnf_id, data, token):
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        push_status_url = self.base_url + '/' + tenant_id + '/' + graph_id + '/' + vnf_id + '/'
        response = requests.put(push_status_url, data=data, headers=headers)
        print(response)
        if response.status_code == 200:
            return {"status": response.status_code}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": json.loads(response.content)}
