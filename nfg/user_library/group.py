"""
Created on 11/04/16

@author: giacomoRanieri
"""


class Group:
    def __init__(self, groupname):
        self.groupname = groupname
        self.users = []
        self.permissions = []
