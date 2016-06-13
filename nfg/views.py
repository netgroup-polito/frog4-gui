#########################################################################
#                       Views django-application                        #
#                                                                       #
# This file contains the following views:                               #
#                                                                       #
#   -index                  --> GET:    /                               #
#   -info                   --> GET:    info/                           #
#   -logout                 --> GET:    logout/                         #
#   -Login                  --> GET:    login/  POST: login/            #
#   -ajax_template_request  --> GET:    ajax_template_request/?         #
#   -ajax_data_request      --> GET:    ajax_data_request/              #
#   -ajax_upload_request    --> POST:   ajax_upload_request/            #
#   -ajax_files_request     --> GET:    ajax_files_request/             #
#   -ajax_save_request      --> POST:   ajax_save_request/              #
#   -ajax_download_preview  --> GET:    ajax_download_preview/          #
#   -ajax_download_request  --> POST:   ajax_download_request/          #
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
from user_library.user_manager import UserManager

# reading config
parser = SafeConfigParser()
parser.read(os.environ["FG-GUI_CONF"])

logging.basicConfig(filename=parser.get('logging', 'filename'), format='%(asctime)s %(levelname)s:%(message)s',
                    level=parser.get('logging', 'level'))
auth = AuthenticationManager(parser.get('un_orchestrator', 'address'),
                             parser.get('un_orchestrator', 'port'))
userm = UserManager(parser.get('un_orchestrator', 'address'),
                    parser.get('un_orchestrator', 'port'))
dbm = DBManager("db.sqlite3")
graphm = NFFGManager(parser.get('un_orchestrator', 'address'),
                     parser.get('un_orchestrator', 'port'))

templatem = TemplateManager(parser.get('vnf-template', 'address'),
                            parser.get('vnf-template', 'port'))


# index: It's a principal view, load gui if you are logged else redirect you at /login/.


def index(request):
    # templates_list = Templates.objects.all()
    if "username" not in request.session:
        return HttpResponseRedirect("/login/")
    else:
        return render(request, 'index.html', {'guiName': parser.get('fg-gui', 'guiName'), 'username': request.session['username']})


# info: It loads the info page if you are logged else redirect you at /login/.
def info(request):
    if "username" not in request.session:
        return HttpResponseRedirect("/login/")
    else:
        return render(request, 'info.html', {'guiName': parser.get('fg-gui', 'guiName'), 'username': request.session['username']})


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
        result = auth.login(username, password)
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


# ajax_template_request: It loads a vnf template specified through his id_template.
#                        The template is in the template_json directory.
def ajax_template_request(request, id_template):
    data = templatem.get_template(id_template)
    if data["status"] == 200:
        res = json.dumps(data["template"])
        return HttpResponse("%s" % res)
    else:
        return HttpResponse("%s" % json.dumps(data["status"]))


# ajax_data_request: It a heart of application.
#                    This view allows you to load the json from database (using a DBManager class)
#                    and it also performs validation.
def ajax_data_request(request):
    logging.debug("Entro in data_request")
    msg = {}

    if "err_msg" in request.session:
        if request.session["err_msg"] != "":
            msg = request.session["err_msg"]
            logging.debug(msg)
            return HttpResponse("%s" % msg)

    if "file_name_fg" not in request.session:
        request.session["file_name_fg"] = "default1"

    json_data = {}

    logging.debug("---->file_name:")
    logging.debug(request.session["file_name_fg"])
    # couple_fg = dbm.getFGByName(request.session["username"], request.session["file_name_fg"])


    couple_fg = graphm.get_user_graph(request.session["file_name_fg"], request.session["token"])

    if couple_fg["status"] != 200:
        res = json.dumps(couple_fg)
        return HttpResponse("%s" % res, status=couple_fg["status"])

    json_data['file_name_fg'] = request.session["file_name_fg"]
    json_data['json_file_fg'] = {"forwarding-graph": couple_fg["forwarding-graph"]}

    # couple_fg[0] ---> json forwarding graph
    # couple_fg[1] ---> json file position

    if couple_fg is None:
        msg["err"] = "File non trovato"
        logging.debug(msg["err"])
        msg = json.dumps(msg)
        return HttpResponse("%s" % msg)

    # print "dopo il db"
    json_data['file_name_fg'] = request.session["file_name_fg"]
    # json_data['json_file_fg'] = json.loads(couple_fg[0].replace("\\", " "))
    # print json_data['json_file_fg']


    # Json file position is present
    json_data['json_file_pos'] = {}
    json_data['is_find_pos'] = 'false'

    # Json file position is not present
    # json_data['json_file_pos'] = json.loads(couple_fg[1].replace("\\", " "))
    # json_data['is_find_pos'] = 'true'

    jsonFG = json_data['json_file_fg']

    json_data_string = json.dumps(json_data)
    # TODO da rimuovere assolutamente
    json_data_string = json_data_string.replace("output_to_port", "output")
    json_data_string = json_data_string.replace("output_to_controller", "controller")

    # Create a validator with use NFFG library
    val = ValidateNF_FG()

    # try:
    #     #val.validate(jsonFG)
    # except Exception as err:
    #     # If the validation failed return a error message
    #     msg["err"] = "Errore di validazione" + err.message
    #    logging.debug(msg["err"])
    #     msg = json.dumps(msg)
    #     return HttpResponse("%s" % msg)

    # If the validation success return a string of json forwarding graph 
    return HttpResponse("%s" % json_data_string)


# ajax_upload_request: 
#                    This view memorize json into database (using a DBManager class)
#                    and it also performs validation.
@csrf_exempt
def ajax_upload_request(request):
    fg = NF_FG()
    val = ValidateNF_FG()
    msg = {}
    # logger = MyLogger("filelog.log", "nffg-gui").get_my_logger()

    if request.method == 'POST':

        file_name_fg = request.POST["file_name_fg"]
        file_content_fg = request.POST["file_content_fg"]

        logging.debug("filecontent: " + file_content_fg)
        logging.debug("filenamefg: " + file_name_fg)

        try:
            jsonFG = json.loads(file_content_fg)
        except Exception as err:

            msg["err"] = "Formato json non valido o file vuoto"
            logging.debug(msg["err"])
            msg = json.dumps(msg)
            return HttpResponse("%s" % msg)

        try:
            val.validate(jsonFG)
        except Exception as err:

            msg["err"] = "Errore di validazione" + err.message
            logging.debug(msg["err"])
            msg = json.dumps(msg)
            return HttpResponse("%s" % msg)

        file_name = file_name_fg.split(".")
        request.session["file_name_fg"] = "" + file_name[0]

        logging.debug("file_name: " + file_name[0])

        ris = dbm.getFGByName(request.session["username"], request.session["file_name_fg"])

        if ris is None:
            logging.debug("file nuovo")
            dbm.insertFGInUser(request.session["username"], request.session["file_name_fg"],
                               json.loads(file_content_fg), None)
        else:
            logging.debug("file modificato")
            dbm.deleteFGByName(request.session["username"], request.session["file_name_fg"])
            dbm.insertFGInUser(request.session["username"], request.session["file_name_fg"],
                               json.loads(file_content_fg), None)

        msg["success"] = "Upload Riuscito"
        logging.debug(msg["success"])
        msg = json.dumps(msg)
        return HttpResponse("%s" % msg)


# ajax_files_request: 
#                    This view return a list of json file memorize on database

def view_templates_request(request):
    with open('nfg/flow_rule_table.json') as data_file:
        data = json.load(data_file)
    return HttpResponse("%s" % json.dumps(data))


def view_match_request(request):
    with open('nfg/nffg_library/schema.json') as data_file:
        data = json.load(data_file)
    t=data["definitions"]["match"]["properties"]

    return HttpResponse("%s" % json.dumps(t))



#def view_ep_request(request):
#    defs=[]
#    with open('nfg/nffg_library/schema.json') as data_file:
 #       data = json.load(data_file)
  #  types=data["properties"]["forwarding-graph"]["properties"]["end-points"]["items"]["properties"]["type"]["enum"]
  #  for t in types:
   #     v=data["definitions"][t]
    #    v["type"]=t
     #   defs.append(v)

    #return HttpResponse("%s" % json.dumps(defs))



def view_ep_request(request):
    with open('nfg/nffg_library/schema.json') as data_file:
        data = json.load(data_file)
    return HttpResponse("%s" % json.dumps(data))


def view_action_request(request):
    with open('nfg/nffg_library/schema.json') as data_file:
        data = json.load(data_file)
    t=data["definitions"]["action"]["properties"]

    return HttpResponse("%s" % json.dumps(t))


def ajax_files_request(request):
    if request.method == "GET":
        lista_file = []
        lista_file = graphm.get_user_graph("", request.session["token"])

        if lista_file["status"] != 200:
            res = json.dumps(lista_file)
            return HttpResponse("%s" % res, status=lista_file["status"])

        json_data_string = json.dumps(lista_file["forwarding-graph"])

    return HttpResponse("%s" % json_data_string)


@csrf_exempt
def ajax_save_request(request):
    fg = NF_FG()
    val = ValidateNF_FG()
    msg = {}

    # logger = MyLogger("filelog.log", "nffg-gui").get_my_logger()
    if request.method == "POST":

        file_name_fg = request.POST["file_name_fg"]
        file_name_pos = request.POST["file_name_pos"]

        json_string = request.POST["file_content_fg"]
        json_string = json_string.replace("output", "output_to_port")
        json_string = json_string.replace("controller", "output_to_controller")

        file_content_fg = json.loads(json_string)
        file_content_pos = json.loads(request.POST["file_content_pos"])

        file_name = file_name_fg.split(".")
        request.session["file_name_fg"] = file_name[0]

        # try:
        # val.validate(file_content_fg)
        # except Exception as err:
        # msg["err"] = "Errore di validazione" + err.message
        # msg = json.dumps(msg)
        # return HttpResponse("%s" % msg)

        ris = dbm.getFGByName(request.session["username"], request.session["file_name_fg"])

        if ris == None:
            logging.debug("file nuovo")
            dbm.insertFGInUser(request.session["username"], request.session["file_name_fg"], file_content_fg,
                               file_content_pos)
        else:
            logging.debug("file modificato")
            dbm.deleteFGByName(request.session["username"], request.session["file_name_fg"])
            dbm.insertFGInUser(request.session["username"], request.session["file_name_fg"], file_content_fg,
                               file_content_pos)

        json_string = request.POST["file_content_fg"]
        json_string = json_string.replace("output", "output_to_port")
        json_string = json_string.replace("controller", "output_to_controller")

        resp = graphm.add_user_graph(request.session["file_name_fg"], json.loads(json_string), request.session["token"])
        if resp["status"] == 201:
            msg["success"] = "Salvataggio Riuscito"
            msg = json.dumps(msg)
        else:
            msg["err"] = "errore di salvataggio"
            msg = json.dumps(msg)

        return HttpResponse("%s" % msg)


@csrf_exempt
def ajax_download_preview(request):
    msg = {}
    json_data = {}
    # logger = MyLogger("filelog.log", "nffg-gui").get_my_logger()
    if request.method == "POST":

        file_name_fg = request.POST["file_name_fg"]
        file_name = file_name_fg.split(".")
        logging.debug(file_name)

        couple_fg = dbm.getFGByName(request.session["username"], file_name[0])

        if couple_fg == None:
            logging.debug("file non trovato")
            msg["err"] = "File non trovato"
            logging.debug(msg["err"])
            msg = json.dumps(msg)
            return HttpResponse("%s" % msg)

        json_data['file_name_fg'] = file_name[0]
        json_data['json_file_fg'] = json.loads(couple_fg[0].replace("\\", " "))

        json_data_string = json.dumps(json_data)

        logging.debug(json_data_string)
        jsonFG = json_data['json_file_fg']

        val = ValidateNF_FG()

        try:
            val.validate(jsonFG)
        except Exception as err:
            msg["err"] = "Errore di validazione" + err.message
            logging.debug(msg["err"])
            msg = json.dumps(msg)
            return HttpResponse("%s" % msg)

        return HttpResponse("%s" % json_data_string)


@csrf_exempt
def ajax_download_request(request):
    fg = NF_FG()
    val = ValidateNF_FG()
    msg = {}
    json_data = {}
    # logger = MyLogger("filelog.log", "nffg-gui").get_my_logger()

    if request.method == "POST":

        file_name_fg = request.POST["file_name_fg"]
        file_name = file_name_fg.split(".")
        logging.debug(file_name)

        logging.debug("ajax download request")



        file_name = file_name_fg.split(".")
        request.session["file_name_fg"] = file_name[0]

        logging.debug(json_data)
        msg["success"] = "Download Riuscito"
        logging.debug(msg["success"])
        msg = json.dumps(msg)
        return HttpResponse("%s" % msg)


# deploy : new view for extends the application
@csrf_exempt
def deploy(request):
    if request.method == "POST":
        msg = {}

        try:
            '''
            Expected a response object with the following fields:
            - 'title' (e.g. "202 Accepted")
            - 'message' (e.g. "Graph 977 succesfully processed.")
            '''

            headers = {'Accept': 'application/json', 'Content-Type': 'application/json',
                       'X-Auth-User': 'admin', 'X-Auth-Pass': 'admin', 'X-Auth-Tenant': 'admin_tenant'}

            # Temporary edits
            # Waiting for support of the new NF-FG library
            json_string = request.POST["file_content_fg"]
            json_string = json_string.replace("output", "output_to_port")
            json_string = json_string.replace("controller", "output_to_controller")

            response = requests.put("http://127.0.0.1:9000/NF-FG/",
                                    json_string,
                                    headers=headers)

            resp_obj = json.loads(response.text)

            if response.status_code >= 200 and response.status_code < 300:
                msg["success"] = str(resp_obj['title'])
            else:
                msg["err"] = str(resp_obj['title'])

            msg["text"] = resp_obj['description']

            msg = json.dumps(msg)
            return HttpResponse("%s " % msg)
        except Exception as err:
            msg["err"] = "Unexpected error"
            if hasattr(err, "description"):
                msg["text"] = err.message
            elif hasattr(err, "args"):
                msg["text"] = err.args[0]
            msg = json.dumps(msg)
            return HttpResponse("%s" % msg)


# users : view to manage users, group and permission
def users(request):
    if "username" not in request.session:
        return HttpResponseRedirect("/login/")
    else:
        return render(request, 'users.html', {'guiName': parser.get('fg-gui', 'guiName'), 'username': request.session['username']})


def api_get_user_list(request):
    if request.method == "GET":
        if "token" in request.session:
            result = userm.get_users(request.session["token"])
            serialized_obj = json.dumps(result)
            return HttpResponse("%s" % serialized_obj, status=result["status"])
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_add_user(request):
    if request.method == "POST":
        if "token" in request.session:

            new_user = json.loads(request.body)

            result = userm.add_user(new_user["username"],
                                    new_user["password"],
                                    new_user["group"],
                                    request.session["token"])
            serialized_obj = json.dumps(result)
            return HttpResponse("%s" % serialized_obj, status=result["status"])
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_delete_user(request):
    if request.method == "DELETE":
        if "token" in request.session:

            user_to_remove = json.loads(request.body)

            result = userm.remove_user(user_to_remove["username"],
                                       request.session["token"])
            serialized_obj = json.dumps(result)
            return HttpResponse("%s" % serialized_obj, status=result["status"])
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_get_group_list(request):
    if request.method == "GET":
        if "token" in request.session:
            result = userm.get_groups(request.session["token"])
            serialized_obj = json.dumps(result)
            return HttpResponse("%s" % serialized_obj, status=result["status"])
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_add_group(request):
    if request.method == "PUT":
        if "token" in request.session:

            new_group = json.loads(request.body)

            result = userm.add_group(new_group["name"],
                                     request.session["token"])
            serialized_obj = json.dumps(result)
            return HttpResponse("%s" % serialized_obj, status=result["status"])
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)


def api_delete_group(request):
    if request.method == "DELETE":
        if "token" in request.session:

            group_to_remove = json.loads(request.body)

            result = userm.remove_group(group_to_remove["name"],
                                        request.session["token"])
            serialized_obj = json.dumps(result)
            return HttpResponse("%s" % serialized_obj, status=result["status"])
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=501)
