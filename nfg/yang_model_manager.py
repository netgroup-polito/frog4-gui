import json
import requests
from nfg.vnf_template_library.template import Template
from nfg.vnf_template_library.exception import TemplateValidationError
from nfg.vnf_template_library.validator import ValidateTemplate


class YANGModelManager:
    def __init__(self, un_host, un_port, datastore_host, datastore_port):
        self.un_protocol = 'http'
        self.un_host = un_host
        self.un_port = un_port
        self.datastore_protocol = 'http'
        self.datastore_host = datastore_host
        self.datastore_port = datastore_port
        self.base_path = ''

    def get_vnf_model(self, tenant_id, graph_id, vnf_identifier, template_uri, token):
        # here a control on the input parameter should be done
        # headers = {'Content-type': 'application/json'}
        # path = "yang/yin/" + "dhcp_cfg"
        # path = "yang/" + vnf_type
        # response = requests.get(
        #    self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + path, headers=headers)
        # if response.status_code == 200:
            # t=json.loads(response.content)["list"]
        #    return {"status": response.status_code,
        #            "model": json.loads(response.content)}
        # else:  # todo: gestione errori comuni
        #    return {"status": response.status_code, "error": "Unknown Error"}
        if template_uri is None:
            response = requests.get(
                self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + 'template/' + graph_id + '/' + vnf_identifier)
            if response.status_code != 200:
                return {"status": response.status_code, "error": "Unknown Error"}
            #TODO test if the template uri of this 'if' branch is built correctly
            template_path = json.load(response.content)['templateUrl']
            template_uri = self.datastore_protocol + '://' + self.datastore_address + ':' + self.datastore_port + '/v2/nf_template' + template_path + '/'
        else:
            template_uri = self.datastore_protocol + '://' + self.datastore_host + ':' + self.datastore_port + '/v2/nf_template/' + template_uri + '/'
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.get(
            template_uri,
            headers=headers)
        if response.status_code == 200:
            template = Template()
            try:
                print("Template received: " + response.text)
                validator = ValidateTemplate()
                validator.validate(json.loads(response.text))
                template.parseDict(response.json())
            except TemplateValidationError as err:
                return {"status": 500, "error": "Template validation failed: " + err.message}

            yang_model_uri = template.uri_yang #the GUI needs the YIN of the model, so I have to modify the string retrieved from the template
            if(yang_model_uri is None):
                return {"status": 404, "error": "yang model uri field not find in template"}
            split = yang_model_uri.split("yang/")
            yin_uri = split[0] + "yang/yin/" + split[1]

            response = requests.get(yin_uri)
            if response.status_code != 200:
                return {"status": response.status_code, "error": "Unknown Error"}
            return {"status": response.status_code,
                    "model": json.loads(response.content)}

        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}