import json
import requests


class NFFGManager:
    def __init__(self, host, port,hostRep,portRep):
        self.un_protocol = 'http'
        self.un_host = host
        self.un_port = port
        self.hostRep = hostRep
        self.portRep = portRep
        self.base_path = ''

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

    def get_graphs(self, token):
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.get(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + 'NF-FG/',
            headers=headers)
        if response.status_code == 200:
            return {"status": response.status_code,
                    "NF-FG": json.loads(response.content)["NF-FG"]}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}

    def get_user_graphs_from_repository(self, token):
        headers = {'Content-type': 'application/json'}
        response = requests.get(
            self.un_protocol + '://' + self.hostRep + ':' + self.portRep + '/' + self.base_path + 'v1/VNF/nffg/all?format=json',
            headers=headers)
        if response.status_code == 200:
            t = json.loads(response.content)["list"]
            return {"status": response.status_code,
                    "template": json.loads(response.content)["list"]}
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

    def get_user_graph_from_local_file(self,name):
        with open('nfg/user_graphs/'+name) as data_file:
            data = json.load(data_file)
        return data

    def save_user_graph_to_local_file(self, name,data):
        with open('nfg/user_graphs/' + name, 'w') as data_file:
            data_file.write(data)
        return
