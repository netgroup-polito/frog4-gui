import requests


class ImageManager:
    def __init__(self, host, port):
        self.un_protocol = 'http'
        self.un_host = host
        self.un_port = port
        self.base_path = ''

    def get_datastore_address(self):
        return {"status": 200,
                "url": self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path}

    def delete_image(self, vnf_id):
        path = 'v2/nf_image/' + vnf_id
        response = requests.delete(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + path)
        if response.status_code == 200:
            return {"status": response.status_code}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}

