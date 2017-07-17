"""
Created on 14/04/16

@author: giacomoRanieri
"""
import json
import requests

# class to handle the comunication with the Orchestrator in order to manage users and groups
class UserManager:
    def __init__(self, orchestrator_endpoint):
        self.orchestrator_endpoint = orchestrator_endpoint[:-6]
    # get list of available user
    def get_users(self, token):
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.get(
            self.orchestrator_endpoint + 'users',
            headers=headers)
        if response.status_code == 200:
            return {"status": response.status_code, "users": json.loads(response.content)["users"]}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}

    # add a new user to orchestrator
    def add_user(self, username, password, group, token):
        data = {'group': group, 'password': password}
        data_json = json.dumps(data)
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.post(
            self.orchestrator_endpoint + 'users/' + username,
            data=data_json,
            headers=headers)
        if response.status_code == 201:
            return {"status": response.status_code}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}

    # remove a user from orchestrator
    def remove_user(self, username, token):
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.delete(
            self.orchestrator_endpoint + 'users/' + username,
            headers=headers)
        if response.status_code == 202:
            return {"status": response.status_code}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}

    # get list of available groups
    def get_groups(self, token):
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.get(
            self.orchestrator_endpoint + 'groups',
            headers=headers)
        if response.status_code == 200:
            return {"status": response.status_code, "groups": json.loads(response.content)["groups"]}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}

    # add a new group to orchestrator
    def add_group(self, groupname, token):
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.put(
            self.orchestrator_endpoint + 'groups/' + groupname,
            headers=headers)
        if response.status_code == 201:
            return {"status": response.status_code}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}

    # remove a group from orchestrator
    def remove_group(self, groupname, token):
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.delete(
            self.orchestrator_endpoint + 'groups/' + groupname,
            headers=headers)
        if response.status_code == 202:
            return {"status": response.status_code}
        else:
            return {"status": response.status_code, "error": "Unknown Error"}

    # currenly not implemented
    def add_user_to_group(self, username, groupname, token):
        data = {'groupname': groupname, 'username': username}
        data_json = json.dumps(data)
        headers = {'Content-type': 'application/json', 'X-Auth-Token': token}
        response = requests.post(
            self.orchestrator_endpoint + 'addUserToGroup/',
            data=data_json,
            headers=headers)
        return True
