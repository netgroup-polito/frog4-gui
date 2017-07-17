import requests

class ImageManager:
    def __init__(self,vnf_template_endpoint):
        self.vnf_template_endpoint = vnf_template_endpoint[:-12]
    def get_datastore_address(self):
        base_url = self.vnf_template_endpoint
        return {"status": 200, "url": base_url[:-3]}

    def delete_image(self, vnf_id):
        path = self.vnf_template_endpoint + 'nf_image/' + vnf_id
        response = requests.delete( path)
        if response.status_code == 200:
            return {"status": response.status_code}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}