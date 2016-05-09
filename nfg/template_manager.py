
import json
import requests

class TemplateManager:
    def __init__(self, host, port):
        self.un_protocol = 'http'
        self.un_host = host
        self.un_port = port
        self.base_path = ''

    def get_template(self, templateId):
        headers = {'Content-type': 'application/json'}
        response = requests.get(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + 'v1/VNF/' + templateId+'/?format=json',
            headers=headers)
        if response.status_code == 200:
            t=json.loads(response.content)["list"]
            return {"status": response.status_code,
                    "template": json.loads(response.content)["list"]}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}


