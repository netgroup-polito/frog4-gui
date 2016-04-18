"""
Created on 11/04/16

@author: giacomoRanieri
"""

import requests
import json


class AuthenticationManager:
    def __init__(self, protocol, host, port, path):
        self.un_protocol = protocol
        self.un_host = host
        self.un_port = port
        self.path = path

    def login(self, username, password):
        # todo: chiamata a servizio

        data = {"username": username, "password": password}
        data_json = json.dumps(data)
        headers = {'Content-type': 'application/json'}
        response = requests.post(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.path + 'login',
            data=data_json,
            headers=headers)

        if response.status_code == 200:
            if response.headers['content-type'] == 'application/token':
                return response.content
            else:
                return
        else:
            return

