"""
Created on 11/04/16

@author: giacomoRanieri
"""

import requests
import json


class AuthenticationManager:
    def __init__(self, orchestrator_endpoint):
        self.orchestrator_endpoint = orchestrator_endpoint[:-6]

    def login(self, username, password):
        data = {"username": username, "password": password}
        data_json = json.dumps(data)
        headers = {'Content-type': 'application/json'}
        response = requests.post(
            self.orchestrator_endpoint + 'login',
            data=data_json,
            headers=headers)
        if response.status_code == 200:
            if len(response.content) == 0:
                return {"status": response.status_code, "error": "No Token in the Response"}
            else:
                return {"status": response.status_code, "token": response.content}
        else:
            if response.status_code == 403:
                return {"status": response.status_code, "error": "User Already Logged"}
            else:
                if response.status_code == 401:
                    return {"status": response.status_code, "error": "Username or password Incorrect"}
                else:
                    return {"status": response.status_code, "error": "Unknown Error"}
