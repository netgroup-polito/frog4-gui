import json
import requests


class NFFGManager:
    def __init__(self, protocol, host, port, base_path):
        self.un_protocol = protocol
        self.un_host = host
        self.un_port = port
        self.base_path = base_path

    def get_user_graph(self, graphId, token):
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.get(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + 'NF-FG/' + graphId,
            headers=headers)
        if response.status_code == 200:
            return {"status": response.status_code,
                    "forwarding-graph": json.loads(response.content)["forwarding-graph"]}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}

    def add_user_graph(self, graphId, nffg, token):
        data_json = json.dumps(nffg)
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.put(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + 'NF-FG/' + graphId,
            data=data_json,
            headers=headers)
        if response.status_code == 201:
            return {"status": response.status_code}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}
