import json
import requests

class NFFGManager:
    def __init__(self,orchestrator_endpoint, graph_repository_endpoint):
        self.orchestrator_endpoint = orchestrator_endpoint
        self.graph_repository_endpoint = graph_repository_endpoint

    def get_user_graph(self, graph_id, token):
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.get(
            self.orchestrator_endpoint + graph_id,
            headers=headers)
        if response.status_code == 200:
            return {"status": response.status_code,
                    "forwarding-graph": json.loads(response.content)["forwarding-graph"]}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}


    def get_graphs(self, token):
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.get(
            self.orchestrator_endpoint,
            headers=headers)
        if response.status_code == 200:
            return {"status": response.status_code,
                    "NF-FG": json.loads(response.content)["NF-FG"]}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}


    def post_user_graph(self, nffg, token):
        data_json = json.dumps(nffg)
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.post(
            self.orchestrator_endpoint,
            data=data_json,
            headers=headers)
        if response.status_code == 201:
            nffg_uuid =  json.loads(response.content)["nffg-uuid"]
            return {"status": response.status_code, "graph_id": nffg_uuid}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}


    def put_user_graph(self, nffg, token, graph_id):
        data_json = json.dumps(nffg)
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.put(
            self.orchestrator_endpoint + graph_id,
            data=data_json,
            headers=headers)
        if response.status_code == 202:
            return {"status": response.status_code}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}


    def delete_user_graph(self, graph_id, token):
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.delete(
            self.orchestrator_endpoint + graph_id,
            headers=headers)
        if response.status_code == 204:
            return {"status": response.status_code}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}


    def get_graph_from_repo(self, graph_id):
        headers = {'Content-type': 'application/json'}
        response = requests.get(
            self.graph_repository_endpoint + graph_id + '/',
            headers=headers)
        if response.status_code == 200:
            return {"status": response.status_code,
                    "forwarding-graph": json.loads(response.content)["forwarding-graph"]}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}


    def get_graphs_from_repo(self):
        headers = {'Content-type': 'application/json'}
        response = requests.get(
            self.graph_repository_endpoint,
            headers=headers)
        if response.status_code == 200:
            return {"status": response.status_code,
                    "graphs": json.loads(response.content)["NF-FG"]}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}


    def put_graph_on_repo(self, nffg):
        data_json = json.dumps(nffg)
        headers = {'Content-type': 'application/json'}
        response = requests.put(
            self.graph_repository_endpoint,
            data=data_json,
            headers=headers)
        if response.status_code == 200:
            nffg_uuid = json.loads(response.content)["nffg-uuid"]
            return {"status": response.status_code, "graph_id_datastore": nffg_uuid}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}


    def delete_graph_from_repo(self, graph_id):
        headers = {'Content-type': 'application/json'}
        response = requests.delete(
            self.graph_repository_endpoint + graph_id + '/',
            headers=headers)
        if response.status_code == 200:
            return {"status": response.status_code}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}


    def update_graph_on_repo(self, nffg, graph_id):
        data_json = json.dumps(nffg)
        headers = {'Content-type': 'application/json'}
        response = requests.put(
            self.graph_repository_endpoint + graph_id + '/',
            data=data_json,
            headers=headers)
        if response.status_code == 200:
            nffg_uuid = json.loads(response.content)["nffg-uuid"]
            return {"status": response.status_code, "graph_id_datastore": nffg_uuid }
        else:
            return {"status": response.status_code, "error": "Unknown Error"}