'''
Created on Oct 30, 2015

@author: fabiomignini
'''
import requests, json

orchestrator_endpoint = "http://127.0.0.1:9000/NF-FG/isp-00000001"
username = 'isp'
password = 'stack'
tenant = 'isp'
headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 
           'X-Auth-User': username, 'X-Auth-Pass': password, 'X-Auth-Tenant': tenant}
requests.delete(orchestrator_endpoint, headers=headers)
print 'Job completed'