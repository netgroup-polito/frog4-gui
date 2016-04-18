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

import json
import os

from DBManager import DBManager
from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect

from django.contrib.auth import authenticate

from django.views.decorators.csrf import csrf_exempt

from nffg_library.nffg import NF_FG
from nffg_library.validator import ValidateNF_FG
from jsonschema import ValidationError
from create_logger import MyLogger

from django.contrib.auth.models import User
from django.core import serializers
import requests

from authentication_manager import AuthenticationManager
import settings

dbm = DBManager("db.sqlite3")
auth = AuthenticationManager(settings.authenticationManager['protocol'],
                             settings.authenticationManager['host'],
                             settings.authenticationManager['port'],
                             settings.authenticationManager['basePath'])
userm = None


# index: It's a principal view, load gui if you are logged else redirect you at /login/.
def index(request):
    if "username" not in request.session:
        return HttpResponseRedirect("/login/")
    else:
        return render(request, 'index.html', {'username': request.session['username']})


# info: It loads the info page if you are logged else redirect you at /login/.
def info(request):
    if "username" not in request.session:
        return HttpResponseRedirect("/login/")
    else:
        return render(request, 'info.html', {'username': request.session['username']})


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

        return render(request, 'login.html', {'title': 'Login', 'err_message': err_msg})

    elif request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        # todo: sostiuire con autenticazione tramite orchestrator
        token = auth.login(username, password)

        if "username" in request.session:
            request.session.flush()

        if token is not None:
            request.session['token'] = token
            request.session['username'] = username

            # todo: sostituire con un valore sensato ( 300 = 5 Min)
            request.session.set_expiry(0)

            return HttpResponseRedirect("/")
        else:
            return HttpResponseRedirect("/login?err_message=Authentication Error!")


# ajax_template_request: It loads a vnf template specified through his id_template.
#                        The template is in the template_json directory.
def ajax_template_request(request, id_template):
    print id_template
    file_directory = "templates_json/" + id_template + ".json"
    print file_directory

    with open(file_directory) as json_file:
        json_data = json.load(json_file)
        json_data = json.dumps(json_data)

        print(json_data)

    return HttpResponse("%s" % json_data)


# ajax_data_request: It a heart of application. 
#                    This view allows you to load the json from database (using a DBManager class)
#                    and it also performs validation.
def ajax_data_request(request):
    print "Entro in data_request"
    msg = {}

    logger = MyLogger("filelog.log", "nffg-gui").get_my_logger()

    if "err_msg" in request.session:
        if request.session["err_msg"] != "":
            msg = request.session["err_msg"]
            logger.debug(msg)
            return HttpResponse("%s" % msg)

    if "file_name_fg" not in request.session:
        request.session["file_name_fg"] = "default"

    json_data = {}

    print "---->file_name:"
    print request.session["file_name_fg"]
    couple_fg = dbm.getFGByName(request.session["username"], request.session["file_name_fg"])

    # couple_fg[0] ---> json forwarding graph
    # couple_fg[1] ---> json file position

    if couple_fg is None:
        msg["err"] = "File non trovato"
        logger.debug(msg["err"])
        msg = json.dumps(msg)
        return HttpResponse("%s" % msg)

    # print "dopo il db"
    json_data['file_name_fg'] = request.session["file_name_fg"]
    json_data['json_file_fg'] = json.loads(couple_fg[0].replace("\\", " "))
    # print json_data['json_file_fg']

    if couple_fg[1] is None:
        # Json file position is present
        json_data['json_file_pos'] = {}
        json_data['is_find_pos'] = 'false'
    else:
        # Json file position is not present
        json_data['json_file_pos'] = json.loads(couple_fg[1].replace("\\", " "))
        json_data['is_find_pos'] = 'true'

    jsonFG = json_data['json_file_fg']

    json_data_string = json.dumps(json_data)

    # Create a validator with use NFFG library
    val = ValidateNF_FG()

    try:
        val.validate(jsonFG)
    except Exception as err:
        # If the validation failed return a error message
        msg["err"] = "Errore di validazione" + err.message
        logger.debug(msg["err"])
        msg = json.dumps(msg)
        return HttpResponse("%s" % msg)

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
    logger = MyLogger("filelog.log", "nffg-gui").get_my_logger()

    if request.method == 'POST':

        file_name_fg = request.POST["file_name_fg"]
        file_content_fg = request.POST["file_content_fg"]

        print "filecontent: " + file_content_fg
        print "filenamefg: " + file_name_fg

        try:
            jsonFG = json.loads(file_content_fg)
        except Exception as err:

            msg["err"] = "Formato json non valido o file vuoto"
            logger.debug(msg["err"])
            msg = json.dumps(msg)
            return HttpResponse("%s" % msg)

        try:
            val.validate(jsonFG)
        except Exception as err:

            msg["err"] = "Errore di validazione" + err.message
            logger.debug(msg["err"])
            msg = json.dumps(msg)
            return HttpResponse("%s" % msg)

        file_name = file_name_fg.split(".")
        request.session["file_name_fg"] = "" + file_name[0]

        print "file_name: " + file_name[0]

        ris = dbm.getFGByName(request.session["username"], request.session["file_name_fg"])

        if ris is None:
            print "file nuovo"
            dbm.insertFGInUser(request.session["username"], request.session["file_name_fg"],
                               json.loads(file_content_fg), None)
        else:
            print "file modificato"
            dbm.deleteFGByName(request.session["username"], request.session["file_name_fg"])
            dbm.insertFGInUser(request.session["username"], request.session["file_name_fg"],
                               json.loads(file_content_fg), None)

        msg["success"] = "Upload Riuscito"
        logger.debug(msg["success"])
        msg = json.dumps(msg)
        return HttpResponse("%s" % msg)


# ajax_files_request: 
#                    This view return a list of json file memorize on database
def ajax_files_request(request):
    if request.method == "GET":
        lista_file = []
        lista_file = dbm.getUserFG(request.session["username"])
        json_data_string = json.dumps(lista_file)

    return HttpResponse("%s" % json_data_string)


@csrf_exempt
def ajax_save_request(request):
    fg = NF_FG()
    val = ValidateNF_FG()
    msg = {}

    logger = MyLogger("filelog.log", "nffg-gui").get_my_logger()
    if request.method == "POST":

        file_name_fg = request.POST["file_name_fg"]
        file_name_pos = request.POST["file_name_pos"]

        file_content_fg = json.loads(request.POST["file_content_fg"])
        file_content_pos = json.loads(request.POST["file_content_pos"])

        file_name = file_name_fg.split(".")
        request.session["file_name_fg"] = file_name[0]

        try:
            val.validate(file_content_fg)
        except Exception as err:
            msg["err"] = "Errore di validazione" + err.message
            msg = json.dumps(msg)
            return HttpResponse("%s" % msg)

        ris = dbm.getFGByName(request.session["username"], request.session["file_name_fg"])

        if ris == None:
            print "file nuovo"
            dbm.insertFGInUser(request.session["username"], request.session["file_name_fg"], file_content_fg,
                               file_content_pos)
        else:
            print "file modificato"
            dbm.deleteFGByName(request.session["username"], request.session["file_name_fg"])
            dbm.insertFGInUser(request.session["username"], request.session["file_name_fg"], file_content_fg,
                               file_content_pos)

        msg["success"] = "Salvataggio Riuscito"
        msg = json.dumps(msg)

        return HttpResponse("%s" % msg)


@csrf_exempt
def ajax_download_preview(request):
    msg = {}
    json_data = {}
    logger = MyLogger("filelog.log", "nffg-gui").get_my_logger()
    if request.method == "POST":

        file_name_fg = request.POST["file_name_fg"]
        file_name = file_name_fg.split(".")
        print file_name

        couple_fg = dbm.getFGByName(request.session["username"], file_name[0])

        if couple_fg == None:
            print "file non trovato"
            msg["err"] = "File non trovato"
            logger.debug(msg["err"])
            msg = json.dumps(msg)
            return HttpResponse("%s" % msg)

        json_data['file_name_fg'] = file_name[0]
        json_data['json_file_fg'] = json.loads(couple_fg[0].replace("\\", " "))

        json_data_string = json.dumps(json_data)

        print json_data_string
        jsonFG = json_data['json_file_fg']

        val = ValidateNF_FG()

        try:
            val.validate(jsonFG)
        except Exception as err:
            msg["err"] = "Errore di validazione" + err.message
            logger.debug(msg["err"])
            msg = json.dumps(msg)
            return HttpResponse("%s" % msg)

        return HttpResponse("%s" % json_data_string)


@csrf_exempt
def ajax_download_request(request):
    fg = NF_FG()
    val = ValidateNF_FG()
    msg = {}
    json_data = {}
    logger = MyLogger("filelog.log", "nffg-gui").get_my_logger()

    if request.method == "POST":

        file_name_fg = request.POST["file_name_fg"]
        file_name = file_name_fg.split(".")
        print file_name

        print "ajax download request"

        couple_fg = dbm.getFGByName(request.session["username"], file_name[0])

        if couple_fg == None:
            print "file non trovato"
            msg["err"] = "File non trovato"
            logger.debug(msg["err"])
            msg = json.dumps(msg)
            return HttpResponse("%s" % msg)

        json_data['file_name_fg'] = file_name[0]
        json_data['json_file_fg'] = json.loads(couple_fg[0].replace("\\", " "))

        json_data_string = json.dumps(json_data)
        jsonFG = json_data['json_file_fg']

        try:
            val.validate(jsonFG)
        except Exception as err:
            msg["err"] = "Errore di validazione" + err.message
            print err.message
            logger.debug(msg["err"])
            msg = json.dumps(msg)
            return HttpResponse("%s" % msg)

        file_name = file_name_fg.split(".")
        request.session["file_name_fg"] = file_name[0]

        print json_data
        msg["success"] = "Download Riuscito"
        logger.debug(msg["success"])
        msg = json.dumps(msg)
        return HttpResponse("%s" % msg)


# deploy : new view for extends the application
@csrf_exempt
def deploy(request):
    if request.method == "POST":
        msg = {};

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
        return render(request, 'users.html', {'username': request.session['username']})


def ajax_get_user_list(request):
    if request.method == "GET":
        user_list = User.objects.all()
        serialized_obj = serializers.serialize('json', user_list)
        # users_string = json.dumps(user_list)
        return HttpResponse("%s" % serialized_obj)  # users_string)
