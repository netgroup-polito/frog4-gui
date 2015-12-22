import json

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

dbm = DBManager("db.sqlite3")


def index(request):
    if "username" not in request.session:
        return HttpResponseRedirect("/nfg/login/")
    else:
        return render(request, 'nfg/index.html', {'username': request.session['username']})


def info(request):
    if "username" not in request.session:
        return HttpResponseRedirect("/nfg/login/")
    else:
        return render(request, 'nfg/info.html', {'username': request.session['username']})


def logout(request):
    if request.method == 'GET':
        if "username" in request.session:
            request.session.flush()

        return HttpResponseRedirect("/nfg/login")


def login(request):
    if request.method == 'GET':
        if "username" in request.session:
            return HttpResponseRedirect("/nfg/")
        if request.GET.has_key('err_message'):
            err_msg = request.GET['err_message']
        else:
            err_msg = ''

        return render(request, 'nfg/login.html', {'title': 'Login', 'err_message': err_msg})

    elif request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(username=username, password=password)

        if user is not None:
            request.session['password'] = password
            request.session['username'] = username

            request.session.set_expiry(0)

            return HttpResponseRedirect("/nfg/")
        else:
            return HttpResponseRedirect("/nfg/login?err_message=Authentication Error!")


def ajax_template_request(request, id_template):
    print id_template
    file_directory = "templates_json/" + id_template + ".json"
    print file_directory

    with open(file_directory) as json_file:
        json_data = json.load(json_file)
        json_data = json.dumps(json_data)

        print(json_data)

    return HttpResponse("%s" % json_data)


def ajax_data_request(request):
    
    msg = {}
    
    logger = MyLogger("filelog.log", "django-application").getMyLogger()

    if "err_msg" in request.session:
        if request.session["err_msg"] != "":
            msg = request.session["err_msg"]
            logger.debug(msg)
            return HttpResponse("%s" % msg)

    if "file_name_fg" not in request.session:
        request.session["file_name_fg"] = "default"

    json_data = {}
    
    couple_fg = dbm.getFGByName(request.session["username"], request.session["file_name_fg"])
    if couple_fg is None:
            msg["err"] = "File non trovato"
            logger.debug(msg["err"])
            msg = json.dumps(msg)
            return HttpResponse("%s" % msg)

    json_data['file_name_fg'] = request.session["file_name_fg"]
    json_data['json_file_fg'] = json.loads(couple_fg[0].replace("\\", " "))

    if couple_fg[1] is None:
        print "valore null"
        json_data['json_file_pos'] = {}
        json_data['is_find_pos'] = 'false'
    else:
        print "non null"
        json_data['json_file_pos'] = json.loads(couple_fg[1].replace("\\", " "))
        json_data['is_find_pos'] = 'true'

    jsonFG = json_data['json_file_fg']

    print "arrivo dopo sjon.load"

    json_data_string = json.dumps(json_data)

    print json_data_string

    val = ValidateNF_FG()

    try:
        val.validate(jsonFG)
    except ValidationError as err:
        msg["err"] = "Errore di validazione" + err.message
        logger.debug(msg["err"])
        msg = json.dumps(msg)
        return HttpResponse("%s" % msg)

    return HttpResponse("%s" % json_data_string)


@csrf_exempt
def ajax_upload_request(request):
    fg = NF_FG()
    val = ValidateNF_FG()
    msg = {}
    logger = MyLogger("filelog.log", "django-application").getMyLogger()

    if request.method == 'POST':
        # print "post"
        #directory = "users/upload@" + request.session["username"]
        #if not os.path.exists(directory):
        #    os.makedirs(directory)
        # memorizzo filename e contenuto del file inviato dall'utente

        file_name_fg = request.POST["file_name_fg"]
        file_content_fg = request.POST["file_content_fg"]
        # memorizzo il filename nella varibile di sessione file_name

        jsonFG = json.loads(file_content_fg)

        try:
            val.validate(jsonFG)
        except ValidationError as err:

            msg["err"] = "Errore di validazione" + err.message
            logger.debug(msg["err"])
            msg = json.dumps(msg)
            return HttpResponse("%s" % msg)

        file_name = file_name_fg.split(".")
        request.session["file_name_fg"] = file_name[0]

        ris = dbm.getFGByName(request.session["username"], request.session["file_name_fg"])

        if ris is None:
            print "file nuovo"
            dbm.insertFGInUser(request.session["username"], request.session["file_name_fg"],json.loads(file_content_fg), None)
        else:
            print "file modificato"
            dbm.deleteFGByName(request.session["username"], request.session["file_name_fg"])
            dbm.insertFGInUser(request.session["username"], request.session["file_name_fg"],json.loads(file_content_fg), None)

        msg["success"] = "Upload Riuscito"
        logger.debug(msg["success"])
        msg = json.dumps(msg)
        return HttpResponse("%s" % msg)


def ajax_files_request(request):
    if request.method == "GET":  # sostituire con metodo post
        
        lista_file = []
        lista_file = dbm.getUserFG(request.session["username"])
        json_data_string = json.dumps(lista_file)
        return HttpResponse("%s" % json_data_string)


@csrf_exempt
def ajax_save_request(request):
    fg = NF_FG()
    val = ValidateNF_FG()
    msg = {}
    
    logger = MyLogger("filelog.log", "django-application").getMyLogger()
    if request.method == "POST":
        
        file_name_fg = request.POST["file_name_fg"]
        file_name_pos = request.POST["file_name_pos"]

        file_content_fg = json.loads(request.POST["file_content_fg"])
        file_content_pos = json.loads(request.POST["file_content_pos"])

        file_name = file_name_fg.split(".")
        request.session["file_name_fg"] = file_name[0]

        try:
            val.validate(file_content_fg)
        except ValidationError as err:
            msg["err"] = "Errore di validazione" + err.message
            msg = json.dumps(msg)
            return HttpResponse("%s" % msg)

        ris = dbm.getFGByName(request.session["username"], request.session["file_name_fg"])

        if ris is None:
            print "file nuovo"
            dbm.insertFGInUser(request.session["username"], request.session["file_name_fg"],file_content_fg, file_content_pos)
        else:
            print "file modificato"
            dbm.deleteFGByName(request.session["username"], request.session["file_name_fg"])
            dbm.insertFGInUser(request.session["username"], request.session["file_name_fg"],file_content_fg, file_content_pos)
        
        msg["success"] = "Salvataggio Riuscito"            
        msg = json.dumps(msg)

        return HttpResponse("%s" % msg)


@csrf_exempt
def ajax_download_preview(request):
    msg={}
    json_data={}
    logger = MyLogger("filelog.log", "django-application").getMyLogger()
    if request.method == "POST":
        
        file_name_fg = request.POST["file_name_fg"]
        file_name = file_name_fg.split(".")
        print file_name

        couple_fg = dbm.getFGByName(request.session["username"], file_name[0])

        if couple_fg is None:
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
        except ValidationError as err:
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
    logger = MyLogger("filelog.log", "django-application").getMyLogger()

    if request.method == "POST":
        file_name_fg = request.POST["file_name_fg"]
        file_name = file_name_fg.split(".")
        print file_name

        print "ajax download request"

        couple_fg = dbm.getFGByName(request.session["username"], file_name[0])

        if couple_fg is None:
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
        except ValidationError as err:
            msg["err"] = "Errore di validazione" + err.message
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
