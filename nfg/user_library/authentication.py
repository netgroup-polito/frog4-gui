"""
Created on 11/04/16

@author: giacomoRanieri
"""

import requests
import json


def login(username, password):
    # todo: chiamata a servizio

    data = {"username": username, "password": password}
    data_json = json.dumps(data)
    headers = {'Content-type': 'application/json'}
    response = requests.post("", data=data_json, headers=headers)

    if response.status_code == 200:
        return True
    else:
        return False


