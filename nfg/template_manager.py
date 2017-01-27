import json
import requests


class TemplateManager:
    def __init__(self, host, port):
        self.un_protocol = 'http'
        self.un_host = host
        self.un_port = port
        self.base_path = ''

    def get_template(self, template_id):
        headers = {'Content-type': 'application/json'}
        path = 'v2/nf_template/' + template_id + '/?format=json'
        response = requests.get(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + path,
            headers=headers)
        if response.status_code == 200:
            # t=json.loads(response.content)["list"]
            return {"status": response.status_code,
                    "template": json.loads(response.content)}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}

# TODO: delete with old gui
#     def get_templates_legacy(self):
#         headers = {'Content-type': 'application/json'}
#         path = 'v1/VNF/all/?format=json'
#         response = requests.get(
#             self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + path,
#             headers=headers)
#         if response.status_code == 200:
#             # t=json.loads(response.content)["list"]
#             return {"status": response.status_code,
#                     "template": json.loads(response.content)["list"]}
#         else:  # todo: gestione errori comuni
#             return {"status": response.status_code, "error": "Unknown Error"}

    def get_templates(self):
        headers = {'Content-type': 'application/json'}
        path = 'v2/nf_template/?format=json'
        response = requests.get(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + path,
            headers=headers)
        if response.status_code == 200:
            # t=json.loads(response.content)["list"]
            return {"status": response.status_code,
                    "templates": json.loads(response.content)["list"]}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}

    def put_template(self, template):
        data_json = json.dumps(template)
        headers = {'Content-Type': u'application/json'}
        path = 'v2/nf_template/'
        response = requests.put(self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + path, data=data_json, headers=headers)
        if response.status_code == 200: #Not 201 CREATED?
            return {"status": response.status_code, "vnf_id": response.content}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}

    def update_template(self, vnf_id, template):
        data_json = json.dumps(template)
        headers = {'Content-Type': u'application/json'}
        path = 'v2/nf_template/' + vnf_id + '/'
        response = requests.put(self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + path, data=data_json, headers=headers)
        if response.status_code == 200: #Not 201 CREATED?
            return {"status": response.status_code}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}

    def delete_template(self, vnf_id):
        path = 'v2/nf_template/' + vnf_id
        response = requests.delete(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + path)
        if response.status_code == 200:
            return {"status": response.status_code}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}
