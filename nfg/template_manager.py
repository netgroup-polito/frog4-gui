import json
import requests

class TemplateManager:
    def __init__(self, vnf_template_endpoint):
        self.vnf_template_endpoint = vnf_template_endpoint

    def get_template(self, template_id):
        headers = {'Content-type': 'application/json'}
        path = self.vnf_template_endpoint + template_id + '/?format=json'
        response = requests.get( path, headers=headers)
        if response.status_code == 200:
            return {"status": response.status_code,
                    "template": json.loads(response.content)}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}

    def get_templates(self):
        headers = {'Content-type': 'application/json'}
        path = self.vnf_template_endpoint + '?format=json'
        response = requests.get( path, headers=headers)
        if response.status_code == 200:
            return {"status": response.status_code,
                    "templates": json.loads(response.content)["list"]}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}

    def put_template(self, template):
        data_json = json.dumps(template)
        headers = {'Content-Type': u'application/json'}
        path = self.vnf_template_endpoint
        response = requests.put(path, data=data_json, headers=headers)
        if response.status_code == 200: #Not 201 CREATED?
            return {"status": response.status_code, "vnf_id": response.content}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}

    def update_template(self, vnf_id, template):
        data_json = json.dumps(template)
        headers = {'Content-Type': u'application/json'}
        path = self.vnf_template_endpoint + vnf_id + '/'
        response = requests.put( path, data=data_json, headers=headers)
        if response.status_code == 200: #Not 201 CREATED?
            return {"status": response.status_code}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}

    def delete_template(self, vnf_id):
        path = self.vnf_template_endpoint + vnf_id
        response = requests.delete(path)
        if response.status_code == 200:
            return {"status": response.status_code}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}
