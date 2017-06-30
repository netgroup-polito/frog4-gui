#########################################################################
#                       Views django-application                        #
#                                                                       #
# This file contains the following views:                               #
#                                                                       #
#   -index                  --> GET:    /                               #
#   -logout                 --> GET:    logout/                         #
#   -Login                  --> GET:    login/  POST: login/            #
#                                                                       #
#########################################################################

import os
import json
import requests
import logging

from ConfigParser import SafeConfigParser

from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from DBManager import DBManager
from nffg_library.nffg import NF_FG
from nffg_library.validator import ValidateNF_FG
from authentication_manager import AuthenticationManager
from nfg.nffg_manager import NFFGManager
from nfg.template_manager import TemplateManager
from nfg.image_manager import ImageManager
from user_library.user_manager import UserManager
from nfg.vnf_configuration_manager import VNFConfigurationManager
from nfg.yang_model_manager import YANGModelManager

# reading config
parser = SafeConfigParser()
parser.read(os.environ["FG-GUI_CONF"])

logging.basicConfig(filename=parser.get('logging', 'filename'), format='%(asctime)s %(levelname)s:%(message)s',
                    level=parser.get('logging', 'level'))
auth = AuthenticationManager(parser.get('orchestrator', 'address'),
                             parser.get('orchestrator', 'port'))
userm = UserManager(parser.get('orchestrator', 'address'),
                    parser.get('orchestrator', 'port'))
dbm = DBManager("db.sqlite3")
graphm = NFFGManager(parser.get('orchestrator', 'address'),
                     parser.get('orchestrator', 'port'),
                     parser.get('vnf-template', 'address'),
                     parser.get('vnf-template', 'port'))

templatem = TemplateManager(parser.get('vnf-template', 'address'),
                            parser.get('vnf-template', 'port'))

imagem = ImageManager(parser.get('vnf-template', 'address'),
                      parser.get('vnf-template', 'port'))

modelm = VNFConfigurationManager(parser.get('vnf-config', 'config_orch_endpoint'))

yangm= YANGModelManager(parser.get('orchestrator', 'address'),
                        parser.get('orchestrator', 'port'),
                        parser.get('vnf-template', 'address'),
                        parser.get('vnf-template', 'port'))


# index: It's a principal view, load gui if you are logged else redirect you at /login/.
def index(request):
    # templates_list = Templates.objects.all()
    if "username" not in request.session:
        return HttpResponseRedirect("/login/")
    else:
        return render(request, 'index.html',
                      {'guiName': parser.get('fg-gui', 'guiName'), 'username': request.session['username']})


# logout: It destroys the session of current user and redirect you at /login.
def logout(request):
    if request.method == 'GET':
        if "username" in request.session:
            request.session.flush()

        return HttpResponseRedirect("/login")


# login: It provides authentication a user and create the session variable
#        If the authentication failed redirect you at /login/ and send 
#        Authentication Error message.
def login(request):
    if request.method == 'GET':
        if "username" in request.session:
            return HttpResponseRedirect("/")
        if request.GET.has_key('err_message'):
            err_msg = request.GET['err_message']
        else:
            err_msg = ''

        return render(request, 'login.html', {'guiName': parser.get('fg-gui', 'guiName'), 'err_message': err_msg})

    elif request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        # todo: sostiuire con autenticazione tramite orchestrator
        try:
            result = auth.login(username, password)
        except:
            return HttpResponseRedirect("/login?err_message=Unable to reach the Orchestrator!")

        # user = authenticate(username=username, password=password)

        if "username" in request.session:
            request.session.flush()

        if "token" in result:
            # if user is not None:
            request.session['token'] = result["token"]
            request.session['username'] = username

            # todo: sostituire con un valore sensato ( 300 = 5 Min)
            request.session.set_expiry(0)

            return HttpResponseRedirect("/")
        else:
            logging.info("%s : %s", str(result["status"]), result["error"])
            if result["status"] == 403:
                if "token" in request.session:
                    return HttpResponseRedirect("/")
                else:
                    return HttpResponseRedirect("/login?err_message=User already logged-in from another terminal!")
            else:
                return HttpResponseRedirect("/login?err_message=Authentication Error!")


# user api
def api_get_user_list(request):
    if request.method == "GET":
        if "token" in request.session:
            try:
                result = userm.get_users(request.session["token"])
            except:
                return HttpResponse(status=503)
            serialized_obj = json.dumps(result)
            return HttpResponse("%s" % serialized_obj, status=result["status"], content_type="application/json")
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_add_user(request):
    if request.method == "POST":
        if "token" in request.session:
            new_user = json.loads(request.body)
            try:
                result = userm.add_user(new_user["username"],
                                        new_user["password"],
                                        new_user["group"],
                                        request.session["token"])
            except:
                return HttpResponse(status=503)
            serialized_obj = json.dumps(result)
            return HttpResponse("%s" % serialized_obj, status=result["status"], content_type="application/json")
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_delete_user(request):
    if request.method == "DELETE":
        if "token" in request.session:
            user_to_remove = json.loads(request.body)
            try:
                result = userm.remove_user(user_to_remove["username"],
                                           request.session["token"])
            except:
                return HttpResponse(status=503)
            serialized_obj = json.dumps(result)
            return HttpResponse("%s" % serialized_obj, status=result["status"], content_type="application/json")
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_get_group_list(request):
    if request.method == "GET":
        if "token" in request.session:
            try:
                result = userm.get_groups(request.session["token"])
            except:
                return HttpResponse(status=503)
            serialized_obj = json.dumps(result)
            return HttpResponse("%s" % serialized_obj, status=result["status"], content_type="application/json")
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_add_group(request):
    if request.method == "PUT":
        if "token" in request.session:
            new_group = json.loads(request.body)
            try:
                result = userm.add_group(new_group["name"],
                                         request.session["token"])
            except:
                return HttpResponse(status=503)
            serialized_obj = json.dumps(result)
            return HttpResponse("%s" % serialized_obj, status=result["status"], content_type="application/json")
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_delete_group(request):
    if request.method == "DELETE":
        if "token" in request.session:
            group_to_remove = json.loads(request.body)
            try:
                result = userm.remove_group(group_to_remove["name"],
                                            request.session["token"])
            except:
                return HttpResponse(status=503)
            serialized_obj = json.dumps(result)
            return HttpResponse("%s" % serialized_obj, status=result["status"], content_type="application/json")
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


# graphs api
def api_get_available_graphs(request):
    if request.method == "GET":
        if "token" in request.session:
            try:
                result = graphm.get_graphs(request.session["token"])
            except:
                return HttpResponse(status=503)
            json_data_string = json.dumps(result)

            return HttpResponse("%s" % json_data_string, status=result["status"], content_type="application/json")
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_get_available_graphs_debug(request):
    if request.method == "GET":

        result = dbm.get_fgs()

        json_data_string = json.dumps(result)

        return HttpResponse("%s" % json_data_string, status=200, content_type="application/json")
    else:
        return HttpResponse(status=501)


def api_put_graph(request):
    if request.method == "PUT":
        if "token" in request.session:

            new_graph = json.loads(request.body)
            try:
                result = graphm.put_user_graph(new_graph["forwarding-graph"]["id"],
                                               new_graph,
                                               request.session["token"])
            except:
                return HttpResponse(status=503)
            serialized_obj = json.dumps(result)
            return HttpResponse("%s" % serialized_obj, status=result["status"], content_type="application/json")
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_delete_graph(request, graph_id):
    if request.method == "DELETE":
        if "token" in request.session:
            try:
                result = graphm.delete_user_graph(graph_id, request.session["token"])
            except:
                return HttpResponse(status=503)
            serialized_obj = json.dumps(result)
            return HttpResponse("%s" % serialized_obj, status=result["status"], content_type="application/json")
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_get_json_schema(request):
    if request.method == "GET":
        try:
            with open('nfg/nffg_library/schema.json') as data_file:
                data = json.load(data_file)
            return HttpResponse("%s" % json.dumps(data), status=200, content_type="application/json")
        except IOError as err:
            logging.error(err.message)
            return HttpResponse(status=404)
    else:
        return HttpResponse(status=501)


def api_get_fr_table_config(request):
    if request.method == "GET":
        try:
            with open('nfg/flow_rules_table_config.json') as data_file:
                data = json.load(data_file)
            return HttpResponse("%s" % json.dumps(data), status=200, content_type="application/json")
        except IOError as err:
            logging.error(err.message)
            return HttpResponse(status=404)
    else:
        return HttpResponse(status=501)


# added by Luigi
def api_get_datastore_address(request):
    if request.method == "GET":
        if "token" in request.session:
            result = imagem.get_datastore_address()
            return HttpResponse("%s" % result["url"], status=result["status"])
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_get_vnf_list(request):
    if request.method == "GET":
        if "token" in request.session:
            try:
                result = templatem.get_templates()
            except:
                return HttpResponse(status=503)
            json_data_string = json.dumps(result)
            return HttpResponse("%s" % json_data_string, status=result["status"], content_type="application/json")
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_put_vnf_template(request):
    if request.method == "PUT":
        if "token" in request.session:
            new_vnf = json.loads(request.body)
            try:
                result = templatem.put_template(new_vnf)
            except:
                return HttpResponse(status=503)
            return HttpResponse("%s" % result["vnf_id"], status=result["status"])
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_update_vnf_template(request, vnf_id):
    if request.method == "PUT":
        if "token" in request.session:
            new_vnf = json.loads(request.body)
            try:
                result = templatem.update_template(vnf_id, new_vnf)
            except:
                return HttpResponse(status=503)
            return HttpResponse(status=result["status"])
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_delete_vnf(request, vnf_id):
    if request.method == "DELETE":
        if "token" in request.session:
            try:
                result = imagem.delete_image(vnf_id)
            except:
                return HttpResponse(status=503)
            if result["status"] == 200:
                try:
                    result = templatem.delete_template(vnf_id)
                except:
                    return HttpResponse(status=503)
                return HttpResponse(status=result["status"])
            else:
                return HttpResponse(status=result["status"])
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_get_available_graphs_from_repo(request):
    if request.method == "GET":
        if "token" in request.session:
            try:
                result = graphm.get_graphs_from_repo()
            except:
                return HttpResponse(status=503)
            json_data_string = json.dumps(result)
            return HttpResponse("%s" % json_data_string, status=result["status"], content_type="application/json")
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_get_graph_from_repo(request, graph_id):
    if request.method == "GET":
        if "token" in request.session:
            try:
                result = graphm.get_graph_from_repo(graph_id)
            except:
                return HttpResponse(status=503)
            json_data_string = json.dumps(result)
            return HttpResponse("%s" % json_data_string, status=result["status"], content_type="application/json")
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_put_graph_on_repo(request):
    if request.method == "PUT":
        if "token" in request.session:
            new_graph = json.loads(request.body)
            try:
                result = graphm.put_graph_on_repo(new_graph["forwarding-graph"]["id"], new_graph)
            except:
                return HttpResponse(status=503)
            serialized_obj = json.dumps(result)
            return HttpResponse("%s" % serialized_obj, status=result["status"], content_type="application/json")
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_delete_graph_from_repo(request, graph_id):
    if request.method == "DELETE":
        if "token" in request.session:
            try:
                result = graphm.delete_graph_from_repo(graph_id)
            except:
                return HttpResponse(status=503)
            serialized_obj = json.dumps(result)
            return HttpResponse("%s" % serialized_obj, status=result["status"], content_type="application/json")
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


# added by riccardo
def status_get_vnf_model(request, tenant_id, graph_id, vnf_identifier):
    # here a control on the input value should be done, even if the control is already done by the regex
    if request.method == "GET":
        if "token" in request.session:
            try:
                result = yangm.get_vnf_model(tenant_id, graph_id, vnf_identifier, request.GET['templateuri'], request.session['token'])
            except Exception as e:
                return HttpResponse(status=503)
            json_data_string = json.dumps(result)
            return HttpResponse("%s" % json_data_string, status=result["status"], content_type="application/json")
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def configure_get_vnf_state(request, tenant_id, graph_id, vnf_identifier):
    if request.method == "GET":
        if "token" in request.session:
            try:
                result = modelm.get_vnf_state(tenant_id, graph_id, vnf_identifier)
            except:
                return HttpResponse(status=503)
            json_data_string = json.dumps(result)
            return HttpResponse("%s" % json_data_string, status=result["status"], content_type="application/json")
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def configure_put_vnf_updated_state(request, tenant_id, graph_id, vnf_identifier):
    if request.method == "PUT":
        if "token" in request.session:
            updated_state = request.body
            try:
                result = modelm.put_vnf_updated_state(tenant_id, graph_id, vnf_identifier, updated_state, request.session["token"])
            except:
                return HttpResponse(status=503)
            serialized_obj = json.dumps(result)
            return HttpResponse("%s" % serialized_obj, status=result["status"], content_type="application/json")
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)
