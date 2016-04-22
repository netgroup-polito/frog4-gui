"""
Created on 14/04/16

@author: giacomoRanieri
"""
import json
import requests


class UserManager:
    def __init__(self, protocol, host, port, base_path):
        self.un_protocol = protocol
        self.un_host = host
        self.un_port = port
        self.base_path = base_path

    def get_users(self, token):
        # todo: chiamata a servizio
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.get(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + 'users',
            headers=headers)
        if response.status_code == 200:
            return {"status": response.status_code, "users": json.loads(response.content)["users"]}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}

    def add_user(self, username, password, group, token):
        # todo: chiamata a servizio
        data = {'group': group, 'password': password}
        data_json = json.dumps(data)
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.put(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + 'users/' + username,
            data=data_json,
            headers=headers)
        return response

    def remove_user(self, username, token):
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.delete(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + 'users/' + username,
            headers=headers)
        return response

    def get_groups(self, token):
        # todo: chiamata a servizio
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.get(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + 'groups',
            headers=headers)
        if response.status_code == 200:
            return {"status": response.status_code, "users": json.loads(response.content)["groups"]}
        else: # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}

    def add_group(self, groupname, token):
        # todo: chiamata a servizio
        data = {'name': groupname}
        data_json = json.dumps(data)
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.put(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + 'groups',
            data=data_json,
            headers=headers)
        # TODO: levare mock
        return True

    def remove_group(self, groupname, token):
        data = {'name': groupname}
        data_json = json.dumps(data)
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.delete(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + 'removeGroup',
            data=data_json,
            headers=headers)
        # TODO: levare mock
        return True

    def add_user_to_group(self, username, groupname, token):
        data = {'groupname': groupname, 'username': username}
        data_json = json.dumps(data)
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.post(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + 'addUserToGroup',
            data=data_json,
            headers=headers)
        # TODO: levare mock
        return True
