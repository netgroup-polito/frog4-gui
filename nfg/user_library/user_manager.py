"""
Created on 14/04/16

@author: giacomoRanieri
"""
import json
import requests

# class to handle the comunication with the UN-Orchestrator in order to manage users and groups
class UserManager:
    def __init__(self, host, port):
        self.un_protocol = 'http'
        self.un_host = host
        self.un_port = port
        self.base_path = ''

    # get list of available user
    def get_users(self, token):
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.get(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + 'users',
            headers=headers)
        if response.status_code == 200:
            return {"status": response.status_code, "users": json.loads(response.content)["users"]}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}

    # add a new user to UN-orchestrator
    def add_user(self, username, password, group, token):
        # todo: chiamata a servizio
        data = {'group': group, 'password': password}
        data_json = json.dumps(data)
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.post(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + 'users/' + username,
            data=data_json,
            headers=headers)
        if response.status_code == 201:
            return {"status": response.status_code}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}

    # remove a user from UN-orchestrator
    def remove_user(self, username, token):
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.delete(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + 'users/' + username,
            headers=headers)
        if response.status_code == 202:
            return {"status": response.status_code}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}

    # get list of available groups
    def get_groups(self, token):
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.get(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + 'groups',
            headers=headers)
        if response.status_code == 200:
            return {"status": response.status_code, "groups": json.loads(response.content)["groups"]}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}

    # add a new group to UN-orchestrator
    def add_group(self, groupname, token):
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.put(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + 'groups/' + groupname,
            headers=headers)
        if response.status_code == 201:
            return {"status": response.status_code}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}

    # remove a group from UN-orchestrator
    def remove_group(self, groupname, token):
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.delete(
            self.un_protocol + '://' + self.un_host + ':' + self.un_port + '/' + self.base_path + 'groups/' + groupname,
            headers=headers)
        if response.status_code == 202:
            return {"status": response.status_code}
        else:  # todo: gestione errori comuni
            return {"status": response.status_code, "error": "Unknown Error"}

    # currenly not implemented
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
