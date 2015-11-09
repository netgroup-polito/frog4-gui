'''
Created on Oct 14, 2015

@author: fabiomignini
'''
import sys, uuid, json, copy
from exception import InexistentLabelFound, WrongNumberOfPorts
from validator import ValidateNF_FG

class NF_FG(object):
    def __init__(self, _id = None, name = None,
                 vnfs = None, end_points = None,
                 flow_rules = None):
        self.id = _id
        self.name = name
        self.vnfs = vnfs or []
        self.end_points = end_points or []
        self.flow_rules = flow_rules or []
    
    def parseDict(self, nffg_dict):
        self.id = nffg_dict['forwarding-graph']['id']
        if 'name' in nffg_dict['forwarding-graph']:
            self.name = nffg_dict['forwarding-graph']['name']
        if 'VNFs' in nffg_dict['forwarding-graph']:
            for vnf_dict in nffg_dict['forwarding-graph']['VNFs']:
                vnf = VNF()
                vnf.parseDict(vnf_dict)
                self.vnfs.append(vnf)
        if 'end-points' in nffg_dict['forwarding-graph']:
            for end_point_dict in nffg_dict['forwarding-graph']['end-points']:
                endpoint = EndPoint()
                endpoint.parseDict(end_point_dict)
                self.end_points.append(endpoint)
        if 'big-switch' in nffg_dict['forwarding-graph']:
            if 'flow-rules' in nffg_dict['forwarding-graph']['big-switch']:
                for flow_rule_dict in nffg_dict['forwarding-graph']['big-switch']['flow-rules']:
                    flow_rule = FlowRule()
                    flow_rule.parseDict(flow_rule_dict)
                    self.flow_rules.append(flow_rule)
    
    def getDict(self, extended = False):
        nffg_dict = {}
        nffg_dict['forwarding-graph'] = {}
        if self.id is not None:
            nffg_dict['forwarding-graph']['id'] = self.id 
        if self.name is not None:
            nffg_dict['forwarding-graph']['name'] = self.name
        vnfs_dict = []
        for vnf in self.vnfs:
            vnfs_dict.append(vnf.getDict(extended))
        if vnfs_dict:
            nffg_dict['forwarding-graph']['VNFs'] = vnfs_dict
        end_points_dict = []
        for end_point in self.end_points:
            end_points_dict.append(end_point.getDict(extended))
        if end_points_dict:
            nffg_dict['forwarding-graph']['end-points'] = end_points_dict
        flow_rules_dict = []
        for flow_rule in self.flow_rules:
            flow_rules_dict.append(flow_rule.getDict(extended))
        if flow_rules_dict:
            nffg_dict['forwarding-graph']['big-switch'] = {}
            nffg_dict['forwarding-graph']['big-switch']['flow-rules'] = flow_rules_dict
        return nffg_dict
    
    def getJSON(self, extended = False):
        return json.dumps(self.getDict(extended)) 
    
    def getVNF(self, vnf_id):
        for vnf in self.vnfs:
            if vnf.id == vnf_id:
                return vnf
    
    def getVNFByDBID(self, vnf_db_id):
        for vnf in self.vnfs:
            if vnf.db_id == vnf_db_id:
                return vnf
    
    def getEndPoint(self, end_point_id):
        for end_point in self.end_points:
            if end_point.id == end_point_id:
                return end_point
    
    def addVNF(self, vnf):
        if type(vnf) is VNF:
            self.vnfs.append(vnf)
        else:
            raise TypeError("Tried to add a vnf with a wrong type. Expected VNF, found "+type(vnf))
    
    def addEndPoint(self, end_point):
        if type(end_point) is EndPoint:
            self.end_points.append(end_point)
        else:
            raise TypeError("Tried to add a end-point with a wrong type. Expected EndPoint, found "+type(end_point))

    def addFlowRule(self, flow_rule):
        if type(flow_rule) is FlowRule:
            self.flow_rules.append(flow_rule)
        else:
            raise TypeError("Tried to add a flow-rules with a wrong type. Expected FlowRule, found "+type(flow_rule))
    
    def getEndPointsFromName(self, end_point_name):
        endpoints = []
        for end_point in self.end_points:
            if end_point.name == end_point_name:
                endpoints.append(end_point)
        return endpoints
    
    def getFlowRulesSendingTrafficToEndPoint(self, endpoint_id):
        return self.getFlowRuleSendingTrafficToNode("endpoint:"+endpoint_id)
    
    def getFlowFulesSendingTrafficFromEndPoint(self, endpoint_id):
        return self.getFlowRuleSendingTrafficFromNode("endpoint:"+endpoint_id)
    
    def getFlowRulesSendingTrafficFromPort(self, vnf_id, port_id):
        return self.getFlowRuleSendingTrafficFromNode("vnf:"+vnf_id+":"+port_id)
    
    def getFlowRulesSendingTrafficToPort(self, vnf_id, port_id):
        return self.getFlowRuleSendingTrafficToNode("vnf:"+vnf_id+":"+port_id)
    
    def getFlowRulesSendingTrafficToVNF(self, vnf):
        flow_rules = []
        for port in vnf.ports:
            flow_rules = flow_rules + self.getFlowRuleSendingTrafficToNode("vnf:"+vnf.id+":"+port.id)
        return flow_rules
    
    def getFlowRulesSendingTrafficFromVNF(self, vnf):
        flow_rules = []
        for port in vnf.ports:
            flow_rules = flow_rules + self.getFlowRuleSendingTrafficFromNode("vnf:"+vnf.id+":"+port.id)
        return flow_rules
    
    def getFlowRuleSendingTrafficToNode(self, node_id):
        flow_rules = []
        for flow_rule in self.flow_rules:
            for action in flow_rule.actions:
                if action.output == node_id:
                    flow_rules.append(flow_rule)
                    continue
        return flow_rules
    
    def getFlowRuleSendingTrafficFromNode(self, node_id):
        flow_rules = []
        for flow_rule in self.flow_rules:
            if flow_rule.match.port_in == node_id:
                flow_rules.append(flow_rule)
        return flow_rules
    
    def expandNode(self, old_vnf, manifest):
        '''
        WARNING: Only 1to1 or 1toN connection among VNFs of internal graph and VNFs of external graph are supported.
        ''' 
        external_nffg = self
        
        # Validate forwarding graph
        ValidateNF_FG(manifest).validate()
        internal_nffg = NF_FG(manifest)
        
        # Add new VNFs in graph
        for internal_vnf in internal_nffg.vnfs:
            external_nffg.addVNF(internal_vnf)
        
        # List on ports of the old VNF. These ports represent the end-point of the internal graph (VNF expanded).
        for end_point_port in old_vnf.listPort:
            # Add connections from internal graph (VNF expanded) to external graph
            internal_outgoing_flowrules = internal_nffg.getFlowRulesSendingTrafficToEndPoint(end_point_port.id)
            external_outgoing_flowrules = external_nffg.getFlowRulesSendingTrafficFromPort(old_vnf.id, end_point_port)
            external_nffg.flow_rules.append(self.mergeFlowrules(internal_outgoing_flowrules, external_outgoing_flowrules))
            # Delete external_outgoing_flowrules from external_nffg.flow_rules
            for external_outgoing_flowrule in external_outgoing_flowrules:
                external_nffg.flow_rules.remove(external_outgoing_flowrule)
            
            # Add connections from external graph to internal graph 
            internal_ingoing_flowrules = internal_nffg.getFlowFulesSendingTrafficFromEndPoint(end_point_port.id)
            external_ingoing_flowrules = external_nffg.getFlowRulesSendingTrafficToPort(old_vnf.id, end_point_port)
            external_nffg.flow_rules.append(self.mergeFlowrules(external_ingoing_flowrules, internal_ingoing_flowrules))
            # Delete external_ingoing_flowrules from external_nffg.flow_rules?
            for external_ingoing_flowrule in external_ingoing_flowrules:
                external_nffg.flow_rules.remove(external_ingoing_flowrule)      
                
        # Delete old VNF
        self.nffg.vnfs.remove(old_vnf)
    
    def attachNF_FG(self, attaching_nffg, end_point_name):
        attaching_end_point = attaching_nffg.getEndPointsFromName(end_point_name)[0]
        end_point = self.nffg.getEndPointsFromName(end_point_name)[0]
        
        if attaching_end_point is None or end_point is None:
            raise Exception("WARNING: Impossible to attach the graph: "+self.nffg.id+" with graph: "+attaching_nffg.id+" on an end-point called: "+end_point_name+", doesn't exit the common end_point.")
        
        # Add connections from internal graph (VNF expanded) to external graph
        attaching_outgoing_flowrules = attaching_nffg.getFlowRulesSendingTrafficToEndPoint(attaching_end_point.id)
        ingoing_flowrules = self.nffg.getFlowRuleSendingTrafficFromEndPoint(end_point.id)
        self.nffg.flow_rules.append(self.mergeFlowrules(attaching_outgoing_flowrules, ingoing_flowrules))
        # Delete external_outgoing_flowrules from external_nffg.flow_rules
        for ingoing_flowrule in ingoing_flowrules:
            self.nffg.flow_rules.remove(ingoing_flowrule)
        
        # Add connections from external graph to internal graph 
        attaching_ingoing_flowrules = attaching_nffg.getFlowFuleSendingTrafficFromEndpoint(attaching_end_point.id)
        outgoing_flowrules = self.nffg.getFlowRuleSendingTrafficToEndpoint(end_point.id)
        self.nffg.flow_rules.append(self.mergeFlowrules(outgoing_flowrules, attaching_ingoing_flowrules))
        # Delete external_ingoing_flowrules from external_nffg.flow_rules?
        for outgoing_flowrule in outgoing_flowrules:
            self.nffg.flow_rules.remove(outgoing_flowrule) 
            
        # Add the VNFs of the attaching graph
        for vnf in attaching_nffg.vnfs:
            self.nffg.vnfs.append(vnf)
        
        # Delete the end-point of the attachment in the graph
        self.nffg.end_points.remove(end_point)
    
    def mergeFlowrules(self, outgoing_flow_rules, ingoing_flow_rules):
        flowrules = []
        for outgoing_flow_rule in outgoing_flow_rules:
            for ingoing_flow_rule in ingoing_flow_rules:
                final_matches = self.mergeMatches(outgoing_flow_rule.matches, ingoing_flow_rule.matches)
                flowrules.append(FlowRule(uuid.uuid4().hex,ingoing_flow_rule.actions, matches = final_matches))
        return flowrules    
    
    def mergeMatches(self, first_matches, second_matches):
        final_matches = []
        match = Match() 
        fields = [match.source_mac, match.dest_mac, match.vlan_id, match.vlan_priority, match.ether_type, match.source_ip,
                   match.dest_ip, match.protocol, match.source_port, match.dest_port, match.tos_bits]
        for first_match in first_matches:
            for second_match in second_matches:
                for field in fields:
                    if field in first_match.of_field and field in second_match.of_field:
                        if first_match.of_field[field] == second_match.of_field[field]:
                            match.of_field[field] = second_match.of_field[field]
                        else:
                            break
                    elif field in first_match.of_field:
                        match.of_field[field] = first_match.of_field[field]
                    elif field in second_match.of_field:
                        match.of_field[field] = second_match.of_field[field]

                match._id = uuid.uuid4().hex
                
                ############################################################
                # WARNING: To avoid priority problems all the connections  #
                #          from a port should be a 1to1 connections        #
                ############################################################
                match.priority = second_match.priority
                ############################################################
                
                final_matches.append(match)
                
        return final_matches
    
    def diff (self, nffg_new):
        nffg = NF_FG()
        nffg.id = nffg_new.id
        nffg.name = nffg_new.name
        
        nffg.vnfs = nffg_new.vnfs
        nffg.end_points = nffg_new.end_points
        nffg.flow_rules = nffg_new.flow_rules 
        
        #VNFs
        for new_vnf in nffg_new.vnfs:
            new_vnf.status = 'new'   
        for old_vnf in self.vnfs:
            vnf_found = False
            for new_vnf in nffg_new.vnfs:
                if old_vnf.id == new_vnf.id and old_vnf.name == new_vnf.name and old_vnf.vnf_template_location == new_vnf.vnf_template_location:
                    new_vnf.status = 'already_deployed'
                    new_vnf.db_id = old_vnf.db_id
                    new_vnf.internal_id = old_vnf.internal_id
                    # check ports
                    
                    for new_port in new_vnf.ports:
                        new_port.status = 'new'
                    for old_port in old_vnf.ports:
                        port_found = False
                        for new_port in new_vnf.ports:
                            if old_port.id == new_port.id:
                                new_port.status = 'already_deployed'
                                new_port.db_id = old_port.db_id
                                new_port.internal_id = old_port.internal_id
                                
                                port_found = True
                                break
                        if port_found is False:
                            old_port.status = 'to_be_deleted'
                            new_vnf.ports.append(old_port)
                    vnf_found = True
                    break
            if vnf_found is False:
                old_vnf.status = 'to_be_deleted'
                nffg.vnfs.append(old_vnf)
        #Endpoints
        for new_endpoint in nffg_new.end_points:
            new_endpoint.status = 'new'
        for old_endpoint in self.end_points:
            endpoint_found = False
            for new_endpoint in nffg_new.end_points:
                if old_endpoint.id == new_endpoint.id and old_endpoint.type == new_endpoint.type\
                 and old_endpoint.vlan_id == new_endpoint.vlan_id and old_endpoint.remote_endpoint_id == new_endpoint.remote_endpoint_id\
                 and old_endpoint.node == new_endpoint.node and old_endpoint.switch_id == new_endpoint.switch_id\
                 and old_endpoint.interface == new_endpoint.interface and old_endpoint.remote_ip == new_endpoint.remote_ip\
                 and old_endpoint.local_ip == new_endpoint.local_ip and old_endpoint.ttl == new_endpoint.ttl\
                 and old_endpoint.local_ip == new_endpoint.local_ip and old_endpoint.ttl == new_endpoint.ttl:
                    new_endpoint.status = 'already_deployed'
                    new_endpoint.db_id = old_endpoint.db_id
                    endpoint_found = True
                    break
            if endpoint_found is False:
                old_endpoint.status = 'to_be_deleted'
                nffg.end_points.append(old_endpoint)
        
        #Flowrules
        for new_flowrule in nffg.flow_rules:
            new_flowrule.status = 'new'
        for old_flowrule in self.flow_rules:
            flowrule_found = False
            for new_flowrule in nffg.flow_rules:
                if old_flowrule.getDict() == new_flowrule.getDict():
                    new_flowrule.status = 'already_deployed'
                    new_flowrule.db_id = old_flowrule.db_id
                    new_flowrule.internal_id = old_flowrule.internal_id
                    flowrule_found = True
                    break
            if flowrule_found is False:
                old_flowrule.status = 'to_be_deleted'
                nffg.flow_rules.append(old_flowrule)
        
        return nffg
                                
class VNF(object):
    def __init__(self, _id = None, name = None,
                vnf_template_location = None, ports = None,
                groups = None, template = None, status = None,
                db_id = None, internal_id = None, availabilty_zone = None):
        self.id = _id
        self.name = name
        self.vnf_template_location = vnf_template_location
        self.template = template
        self.ports = ports or []
        self.groups = groups or []
        self.status = status
        self.db_id = db_id
        self.internal_id = internal_id
        self.availabilty_zone = availabilty_zone
    
    def parseDict(self, vnf_dict):
        self.id = vnf_dict['id']
        if 'name' in vnf_dict:
            self.name = vnf_dict['name']
        if 'vnf_template' in vnf_dict:
            self.vnf_template_location = vnf_dict['vnf_template']
        for port_dict in vnf_dict['ports']:
            port = Port()
            port.parseDict(port_dict)
            self.ports.append(port)
        if 'groups' in vnf_dict:
            self.groups = vnf_dict['groups']
        
    def getDict(self, extended = False):
        vnf_dict = {}
        if self.id is not None:
            vnf_dict['id'] = self.id 
        if self.name is not None:
            vnf_dict['name'] = self.name
        if self.vnf_template_location is not None:
            vnf_dict['vnf_template'] = self.vnf_template_location
        ports_dict = []
        for port in self.ports:
            ports_dict.append(port.getDict(extended))
        if ports_dict:
            vnf_dict['ports'] = ports_dict
        if self.groups:
            vnf_dict['groups'] = self.groups
        if extended is True:
            if self.status is not None:
                vnf_dict['status'] = self.status 
            if self.db_id is not None:
                vnf_dict['db_id'] = self.db_id
            if self.internal_id is not None:
                vnf_dict['internal_id'] = self.internal_id
        return vnf_dict
    
    def getPort(self, port_id):
        for port in self.ports:
            if port.id == port_id:
                return port
    
    def addPort(self, port):
        if type(port) is Port:
            self.ports.append(port)
        else:
            raise TypeError("Tried to add a port with a wrong type. Expected Port, found "+type(port))    
    
    def addTemplate(self, template):
        self.template = template
        
    def checkPortsAgainstTemplate(self):
        labels = {}
        for port in self.ports:
            if port.id.split(':')[0] in labels:
                labels[port.id.split(':')[0]] += 1
            else:
                labels[port.id.split(':')[0]] = 1
        
        
        for label, num_ports_per_label in labels.iteritems():
            found = False
            for template_port in self.template.ports:
                if label == template_port.label:
                    if template_port.position.split('-')[1] == 'N' or template_port.position.split('-')[1] == 'n':
                        maximum_number_of_ports_per_label = sys.maxint
                    else:
                        maximum_number_of_ports_per_label = int(template_port.position.split('-')[0]) - int(template_port.position.split('-')[1]) + 1
                    minimum_number_of_ports_per_label = int(template_port.min)
                    found = True
                    
            # Check if the label of the vnf's ports exist in the template
            if found is False:
                raise InexistentLabelFound("Inexistent label found: "+str(label))
            
            # Check maximum number of port per label
            if num_ports_per_label > maximum_number_of_ports_per_label:
                raise WrongNumberOfPorts("The maximum number of port for: "+str(label)+" is: "+str(maximum_number_of_ports_per_label)+" found: "+str(num_ports_per_label))
            
            # Check minimum number of port per label
            if num_ports_per_label < minimum_number_of_ports_per_label:
                raise WrongNumberOfPorts("The minimum number of port for: "+str(label)+" is: "+str(minimum_number_of_ports_per_label)+" found: "+str(num_ports_per_label))
        
        for port in self.ports:
            # TODO: Check that, the relative index of the port doesn't exceed the maximum number of ports for that label
            pass
    
    def deleteAllConnections(self):
        raise NotImplementedError()
    
    def deleteConnectionsToVNF(self, vnf_id):
        raise NotImplementedError()
    
    def deleteConnections(self, node_id):
        self.deleteIncomingFlowrule(self, node_id)
        self.deletOutcomingFlowrule(self, node_id)
        
    def deleteIncomingFlowrule(self, node_id):
        for flow_rule in self.flow_rules[:]:
            for action in flow_rule.actions:
                if flow_rule.match.port_in == node_id and action.output == self.id:
                    self.flow_rules.remove(flow_rule)
                    continue
    
    def deletOutcomingFlowrule(self, node_id):
        for flow_rule in self.flow_rules[:]:
            for action in flow_rule.actions:
                if flow_rule.match.port_in == self.id and action.output == node_id:
                    self.flow_rules.remove(flow_rule)
    
    def getHigherReletiveIDForPortLabel(self, label):
        max_relative_id = 0
        for port in self.ports:
            if port.id.split(":")[0] == label:
                if port.id.split(":")[1] > max_relative_id:
                    max_relative_id = port.id.split(":")[1]
        return max_relative_id
        
class Port(object):
    def __init__(self, _id = None, name = None, _type = None, status = None, db_id = None, internal_id = None):
        self.id = _id
        self.name = name
        self.type = _type
        self.status = status
        self.db_id = db_id
        self.internal_id = internal_id
        
    def parseDict(self, port_dict):
        self.id = port_dict['id']
        if 'name' in port_dict:
            self.name = port_dict['name']
        
    def getDict(self, extended = False):
        port_dict = {}
        if self.id is not None:
            port_dict['id'] = self.id
        if self.name is not None:
            port_dict['name'] = self.name
        if extended is True:
            if self.type is not None:
                port_dict['type'] = self.type
            if self.status is not None:
                port_dict['status'] = self.status 
            if self.db_id is not None:
                port_dict['db_id'] = self.db_id
            if self.internal_id is not None:
                port_dict['internal_id'] = self.internal_id            
        return port_dict

class EndPoint(object):
    def __init__(self, _id = None, name = None, _type = None, 
                 remote_endpoint_id = None, node = None, switch_id = None,
                 interface = None, remote_ip = None, local_ip = None, ttl = None,
                 status = None, db_id = None, internal_id = None, vlan_id = None, 
                 interface_internal_id = None):
        '''
        Parameters
        ----------
        _id : string
           Id of the end-point.
        name : string
           Name of the end-point.
        _type : string
           Type of the end-point, it could be 'internal', 'interface', 'interface_out', 'gre_tunnel', 'vlan'.
        remote_endpoint_id : string
           Identify the remote end-point where this end-point will be connected.
           The layout of the string will be: 'id-remote-graph:id-remote-endpoint'.
           It is an optional field.
        node : string
           Optional field. Its meaning depends on the value of field _type
        switch_id : string
           Optional field. Its meaning depends on the value of field _type
        interface : string
           Optional field. Its meaning depends on the value of field _type
        remote_ip : string
           Optional field. Its meaning depends on the value of field _type
        local_ip : string
           Optional field. Its meaning depends on the value of field _type
        ttl : string
           Optional field. Its meaning depends on the value of field _type
        '''
        self.id = _id
        self.name = name
        self.type = _type
        self.remote_endpoint_id = remote_endpoint_id
        self.node = node
        self.switch_id = switch_id
        self.interface = interface
        self.remote_ip = remote_ip
        self.local_ip = local_ip
        self.ttl = ttl
        self.vlan_id = vlan_id
        self.status = status
        self.db_id = db_id
        self.internal_id = internal_id
        self.interface_internal_id = interface_internal_id
        
    def parseDict(self, end_point_dict):
        self.id = end_point_dict['id']
        if 'name' in end_point_dict:
            self.name = end_point_dict['name']
        if 'remote_endpoint_id' in end_point_dict:
            self.remote_endpoint_id = end_point_dict['remote_endpoint_id']
        if 'type' in end_point_dict:
            self.type = end_point_dict['type']
            if self.type == 'interface' or self.type == 'interface-out':
                self.interface = end_point_dict[self.type]['interface']
                if 'node' in end_point_dict[self.type]:
                    self.node = end_point_dict[self.type]['node']
                if 'switch_id' in end_point_dict[self.type]:
                    self.switch_id = end_point_dict[self.type]['switch_id']
            elif self.type == 'gre-tunnel':
                self.remote_ip = end_point_dict[self.type]['remote_ip']
                self.local_ip = end_point_dict[self.type]['local_ip']
                self.interface = end_point_dict[self.type]['interface']
                if 'ttl' in end_point_dict[self.type]:
                    self.ttl = end_point_dict[self.type]['ttl']   
            elif self.type == 'vlan':
                self.interface = end_point_dict[self.type]['interface']
                self.vlan_id = end_point_dict[self.type]['vlan-id']
                if 'node' in end_point_dict[self.type]:
                    self.node = end_point_dict[self.type]['node']
                if 'switch-id' in end_point_dict[self.type]:
                    self.switch_id = end_point_dict[self.type]['switch-id']
         
    def getDict(self, extended = False):
        end_point_dict = {}
        if self.id is not None:
            end_point_dict['id'] = self.id
        if self.name is not None:
            end_point_dict['name'] = self.name
        if self.remote_endpoint_id is not None:
            end_point_dict['remote_endpoint_id'] = self.remote_endpoint_id  
        if self.type is not None:
            end_point_dict['type'] = self.type
            if self.type != 'internal':
                end_point_dict[self.type] = {}
                if self.node is not None:
                    end_point_dict[self.type]['node'] = self.node
                if self.switch_id is not None:
                    end_point_dict[self.type]['switch_id'] = self.switch_id     
                if self.interface is not None:
                    end_point_dict[self.type]['interface'] = self.interface
                if self.remote_ip is not None:
                    end_point_dict[self.type]['remote_ip'] = self.remote_ip  
                if self.local_ip is not None:
                    end_point_dict[self.type]['local_ip'] = self.local_ip     
                if self.ttl is not None:
                    end_point_dict[self.type]['ttl'] = self.ttl
                if self.vlan_id is not None:
                    end_point_dict[self.type]['vlan_id'] = self.vlan_id             
        if extended is True:
            if self.status is not None:
                end_point_dict['status'] = self.status 
            if self.db_id is not None:
                end_point_dict['db_id'] = self.db_id
            if self.internal_id is not None:
                end_point_dict['internal_id'] = self.internal_id
            if self.interface_internal_id is not None:
                end_point_dict['interface_internal_id'] = self.interface_internal_id
        return end_point_dict   

    def deleteAllConnections(self):
        deleted_flows = []
        for flow_rule in self.flow_rules[:]:
            for action in flow_rule.actions:
                if action.output == "endpoint:"+self.id:
                    deleted_flows.append(copy.deepcopy(flow_rule))
                    self.flow_rules.remove(flow_rule)
                    continue
        for flow_rule in self.flow_rules[:]:
            for action in flow_rule.actions:
                if flow_rule.match.port_in == "endpoint:"+self.id:
                    deleted_flows.append(copy.deepcopy(flow_rule))
                    self.flow_rules.remove(flow_rule)        
        return deleted_flows

class FlowRule(object):
    def __init__(self, _id = None, priority = None,
                 match = None, actions = None, status = None,
                 db_id = None, internal_id = None):
        self.id = _id
        self.priority = priority
        self.match = match
        self.actions = actions or []
        self.status = status
        self.db_id = db_id
        self.internal_id = internal_id
    
    def parseDict(self, flow_rule_dict):
        self.id = flow_rule_dict['id']
        self.priority = flow_rule_dict['priority']
        match = Match()
        match.parseDict(flow_rule_dict['match'])
        self.match = match
        for action_dict in flow_rule_dict['actions']:
            action = Action()
            action.parseDict(action_dict)
            self.actions.append(action)
        
    def getDict(self, extended = False):
        flow_rule_dict = {}
        if self.id is not None:
            flow_rule_dict['id'] = self.id
        if self.priority is not None:
            flow_rule_dict['priority'] = self.priority
        if self.match is not None:
            flow_rule_dict['match'] = self.match.getDict(extended)
        actions = []
        for action in self.actions:
            actions.append(action.getDict(extended))
        flow_rule_dict['actions'] = actions
        if extended is True:
            if self.status is not None:
                flow_rule_dict['status'] = self.status 
            if self.db_id is not None:
                flow_rule_dict['db_id'] = self.db_id
            if self.internal_id is not None:
                flow_rule_dict['internal_id'] = self.internal_id            
        return flow_rule_dict
          
    def changeIngressPortOfFlowRule(self, old_port_id, new_port_id):
        if self.id == old_port_id:
            self.id = new_port_id
            return new_port_id
        return None
    
class Match(object):
    def __init__(self, port_in=None, 
                 ether_type = None, vlan_id = None, 
                 vlan_priority = None, source_mac = None,
                 dest_mac = None, source_ip = None,
                 dest_ip = None, tos_bits = None,
                 source_port = None, dest_port = None,
                 protocol = None, db_id = None):
        '''
        It contains all the openflow 1.0 match types.
        
        uint32_t wildcards; /* Wildcard fields. */
        uint16_t in_port; /* Input switch port. */
        uint8_t dl_src[OFP_ETH_ALEN]; /* Ethernet source address. */
        uint8_t dl_dst[OFP_ETH_ALEN]; /* Ethernet destination address. */
        uint16_t dl_vlan; /* Input VLAN id. */
        uint8_t dl_vlan_pcp; /* Input VLAN priority. */
        uint8_t pad1[1]; /* Align to 64-bits */
        uint16_t dl_type; /* Ethernet frame type. */
        uint8_t nw_tos; /* IP ToS (actually DSCP field, 6 bits). */
        uint8_t nw_proto; /* IP protocol or lower 8 bits of
        * ARP opcode. */
        uint8_t pad2[2]; /* Align to 64-bits */
        uint32_t nw_src; /* IP source address. */
        uint32_t nw_dst; /* IP destination address. */
        uint16_t tp_src; /* TCP/UDP source port. */
        uint16_t tp_dst; /* TCP/UDP destination port. */
        '''
        self.port_in = port_in
        self.ether_type = ether_type
        self.vlan_id = vlan_id
        self.vlan_priority = vlan_priority
        self.source_mac = source_mac
        self.dest_mac = dest_mac
        self.source_ip = source_ip
        self.dest_ip = dest_ip
        self.tos_bits = tos_bits
        self.source_port = source_port
        self.dest_port = dest_port
        self.protocol = protocol
        self.db_id = db_id
    
    def parseDict(self, match_dict):
        if 'port_in' in match_dict:
            self.port_in = match_dict['port_in']
        if 'ether_type' in match_dict:
            self.ether_type = match_dict['ether_type']
        if 'vlan_id' in match_dict:
            self.vlan_id = match_dict['vlan_id']
        if 'vlan_priority' in match_dict:
            self.vlan_priority = match_dict['vlan_priority']       
        if 'source_mac' in match_dict:
            self.source_mac = match_dict['source_mac']
        if 'dest_mac' in match_dict:
            self.dest_mac = match_dict['dest_mac']
        if 'source_ip' in match_dict:
            self.source_ip = match_dict['source_ip']
        if 'dest_ip' in match_dict:
            self.dest_ip = match_dict['dest_ip']  
        if 'tos_bits' in match_dict:
            self.tos_bits = match_dict['tos_bits']
        if 'source_port' in match_dict:
            self.source_port = match_dict['source_port']
        if 'dest_port' in match_dict:
            self.dest_port = match_dict['dest_port']
        if 'protocol' in match_dict:
            self.protocol = match_dict['protocol']                                                

        
    def getDict(self, extended = False):
        match_dict = {} 
        if self.port_in is not None:
            match_dict['port_in'] = self.port_in  
        if self.ether_type is not None:
            match_dict['ether_type'] = self.ether_type  
        if self.vlan_id is not None:
            match_dict['vlan_id'] = self.vlan_id  
        if self.vlan_priority is not None:
            match_dict['vlan_priority'] = self.vlan_priority  
        if self.source_mac is not None:
            match_dict['source_mac'] = self.source_mac  
        if self.dest_mac is not None:
            match_dict['dest_mac'] = self.dest_mac  
        if self.source_ip is not None:
            match_dict['source_ip'] = self.source_ip  
        if self.dest_ip is not None:
            match_dict['dest_ip'] = self.dest_ip
        if self.tos_bits is not None:
            match_dict['tos_bits'] = self.tos_bits  
        if self.source_port is not None:
            match_dict['source_port'] = self.source_port  
        if self.dest_port is not None:
            match_dict['dest_port'] = self.dest_port
        if self.protocol is not None:
            match_dict['protocol'] = self.protocol
        if extended is True:
            if self.db_id is not None:
                match_dict['db_id'] = self.db_id
        return match_dict

class Action(object):
    def __init__(self, output = None, controller = False, drop=False, set_vlan_id = None,
                 set_vlan_priority = None, pop_vlan = None,
                 set_ethernet_src_address = None, set_ethernet_dst_address= None,
                 set_ip_src_address = None, set_ip_dst_address= None,
                 set_ip_tos = None, set_l4_src_port=None,
                 set_l4_dst_port = None, output_to_queue= None, db_id = None):
        '''
        It contains all the openflow 1.0 action types.
        
        OFPAT_OUTPUT, /* Output to switch port. */
        OFPAT_SET_VLAN_VID, /* Set the 802.1q VLAN id. */
        OFPAT_SET_VLAN_PCP, /* Set the 802.1q priority. */
        OFPAT_STRIP_VLAN, /* Strip the 802.1q header. */
        OFPAT_SET_DL_SRC, /* Ethernet source address. */
        OFPAT_SET_DL_DST, /* Ethernet destination address. */
        OFPAT_SET_NW_SRC, /* IP source address. */
        OFPAT_SET_NW_DST, /* IP destination address. */
        OFPAT_SET_NW_TOS, /* IP ToS (DSCP field, 6 bits). */
        OFPAT_SET_TP_SRC, /* TCP/UDP source port. */
        OFPAT_SET_TP_DST, /* TCP/UDP destination port. */
        OFPAT_ENQUEUE, /* Output to queue. */
        '''
        self.output = output
        self.controller = controller
        self.drop = drop
        self.set_vlan_id = set_vlan_id
        self.set_vlan_priority = set_vlan_priority
        self.pop_vlan = pop_vlan
        self.set_ethernet_src_address = set_ethernet_src_address
        self.set_ethernet_dst_address = set_ethernet_dst_address
        self.set_ip_src_address = set_ip_src_address
        self.set_ip_dst_address = set_ip_dst_address
        self.set_ip_tos = set_ip_tos
        self.set_l4_src_port = set_l4_src_port
        self.set_l4_dst_port = set_l4_dst_port
        self.output_to_queue = output_to_queue
        self.db_id = db_id
        
    def parseDict(self, action_dict):
        if 'output' in action_dict:
            self.output = action_dict['output']
        if 'controller' in action_dict:
            self.controller = action_dict['controller']
        if 'drop' in action_dict:
            self.controller = action_dict['drop']
        if 'set_vlan_id' in action_dict:
            self.set_vlan_id = action_dict['set_vlan_id']
        if 'set_vlan_priority' in action_dict:
            self.set_vlan_priority = action_dict['set_vlan_priority']
        if 'pop_vlan' in action_dict:
            self.pop_vlan = action_dict['pop_vlan']         
        if 'set_ethernet_src_address' in action_dict:
            self.set_ethernet_src_address = action_dict['set_ethernet_src_address']
        if 'set_ethernet_dst_address' in action_dict:
            self.set_ethernet_dst_address = action_dict['set_ethernet_dst_address']
        if 'set_ip_src_address' in action_dict:
            self.set_ip_src_address = action_dict['set_ip_src_address']
        if 'set_ip_dst_address' in action_dict:
            self.set_ip_dst_address = action_dict['set_ip_dst_address']  
        if 'set_ip_tos' in action_dict:
            self.set_ip_tos = action_dict['set_ip_tos']
        if 'set_l4_src_port' in action_dict:
            self.set_l4_src_port = action_dict['set_l4_src_port']
        if 'set_l4_dst_port' in action_dict:
            self.set_l4_dst_port = action_dict['set_l4_dst_port']
        if 'output_to_queue' in action_dict:
            self.output_to_queue = action_dict['output_to_queue']                              
    
    def getDict(self, extended = False):
        action_dict = {}      
        if self.output is not None:
            action_dict['output'] = self.output  
        if self.controller is not False:
            action_dict['controller'] = self.controller  
        if self.drop is not False:
            action_dict['drop'] = self.drop  
        if self.set_vlan_id is not None:
            action_dict['set_vlan_id'] = self.set_vlan_id
        if self.set_vlan_priority is not None:
            action_dict['set_vlan_priority'] = self.set_vlan_priority  
        if self.pop_vlan is not None:
            action_dict['pop_vlan'] = self.pop_vlan  
        if self.set_ethernet_src_address is not None:
            action_dict['set_ethernet_src_address'] = self.set_ethernet_src_address  
        if self.set_ethernet_dst_address is not None:
            action_dict['set_ethernet_dst_address'] = self.set_ethernet_dst_address  
        if self.set_ip_src_address is not None:
            action_dict['set_ip_src_address'] = self.set_ip_src_address  
        if self.set_ip_dst_address is not None:
            action_dict['set_ip_dst_address'] = self.set_ip_dst_address  
        if self.set_ip_tos is not None:
            action_dict['set_ip_tos'] = self.set_ip_tos
        if self.set_l4_src_port is not None:
            action_dict['set_l4_src_port'] = self.set_l4_src_port  
        if self.set_l4_dst_port is not None:
            action_dict['set_l4_dst_port'] = self.set_l4_dst_port  
        if self.output_to_queue is not None:
            action_dict['output_to_queue'] = self.output_to_queue
        if extended is True:
            if self.db_id is not None:
                action_dict['db_id'] = self.db_id            
        return action_dict
        