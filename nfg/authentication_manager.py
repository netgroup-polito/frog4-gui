"""
Created on 11/04/16

@author: giacomoRanieri
"""

import requests
import json


class AuthenticationManager:
    def __init__(self, host, port):
        self.un_protocol = 'http'
        self.un_host = host
        self.un_port = port
        self.path = ''

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
                return {"status": response.status_code, "token": response.content}
            else:
                return {"status": response.status_code, "error": "No Token in the Response"}
        else:
            if response.status_code == 403:
                return {"status": response.status_code, "error": "User Already Logged"}
            else:
                if response.status_code == 401:
                    return {"status": response.status_code, "error": "Username or password Incorrect"}
                else:
                    return {"status": response.status_code, "error": "Unknown Error"}
