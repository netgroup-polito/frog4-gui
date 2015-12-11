import logging
import json
import requests
import os.path
import os

import urllib

from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import RequestContext, loader

from django.contrib.auth import authenticate


from vnf_template_library.template import Template

from pprint import pprint
from django.views.decorators.csrf import csrf_exempt

from nffg_library.nffg import NF_FG
from nffg_library.validator import ValidateNF_FG
from jsonschema import validate, ValidationError

def index(request):
	if "username" not in request.session:
		return HttpResponseRedirect("/nfg/login/")
	else:		
		return render(request,'nfg/index.html',{'username':request.session['username']})

def info(request):
  if "username" not in request.session:
    return HttpResponseRedirect("/nfg/login/")
  else:   
    return render(request,'nfg/info.html',{'username':request.session['username']})

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

		return render(request,'nfg/login.html',{'title':'Login','err_message':err_msg})

	elif request.method == 'POST':
		username = request.POST['username']
		password = request.POST['password']

		user = authenticate(username=username,password=password)

		if user is not None:
			request.session['password'] = password
			request.session['username'] = username

			request.session.set_expiry(0)
			

			return HttpResponseRedirect("/nfg/")
		else:
			return HttpResponseRedirect("/nfg/login?err_message=Authentication Error!")

def ajax_template_request(request,id_template):

  print id_template;
  file_directory = "templates_json/" + id_template + ".json"
  print file_directory


  with open(file_directory) as json_file:
    json_data = json.load(json_file)
    json_data = json.dumps(json_data)

    print(json_data)

  return HttpResponse("%s" % json_data)

	

def ajax_data_request(request):
  fg = NF_FG()
  val = ValidateNF_FG()

  if "err_msg" in request.session:
    print "si"
    if request.session["err_msg"]!="":

      msg = request.session["err_msg"]
      #request.session["err_msg"] = ""

      return HttpResponse("%s" % msg)


      

  directory = "users/upload@"+request.session["username"]
  print directory

  if "file_name_fg" in request.session:
    file_name_fg = request.session["file_name_fg"]
  else:
    file_name_fg = "00000001.json"      #file json di default
    request.session["file_name_fg"] = file_name_fg
  
  print file_name_fg
  (shortname, extension) = os.path.splitext(file_name_fg)

  print extension
  
  json_data = {}

  print directory+"/"+file_name_fg
  if(extension == ".json"):
    if os.path.isfile(directory+"/"+file_name_fg):
      print "file trovato"
      json_file_fg = open(directory+"/"+file_name_fg,"r")
      json_data_fg = json.load(json_file_fg)

      try:
        #effettuo la validazione lato server#
        val.validate(json_data_fg)
        json_data['json_file_fg'] = json_data_fg
        json_file_fg.close()


      except ValidationError as err:
        msg = "errore di validazione:" + err.message 
        return HttpResponse("%s" % msg)
      
      if "file_name_pos" in request.session:


        file_name_pos = request.session["file_name_pos"]
        print file_name_pos
        
        json_file_pos = open(directory+"/"+file_name_pos,"r")
        json_data_pos = json.load(json_file_pos)
        json_file_pos.close()

        json_data['is_find_pos'] = 'true'
        json_data['json_file_pos'] = json_data_pos


        print "file di posizionamento trovato nella sessione"


      else:

        len_file_name = len(file_name_fg)
        file_name_pos = file_name_fg[0:len_file_name-5]
        file_name_pos += "_pos.json"

        if os.path.isfile(directory+"/"+file_name_pos):

          print "file di posizionamento presente"
          json_file_pos = open(directory+"/"+file_name_pos,"r")
          json_data_pos = json.load(json_file_pos)
          json_file_pos.close()

          json_data['is_find_pos'] = 'true'
          json_data['json_file_pos'] = json_data_pos


        else:

          print "file di posizionamento non presente"
          json_data['is_find_pos'] = 'false'
          json_data['json_file_pos'] = {}
            
    else:
      print "file non trovato"


  else:
    print "formato file non valido"
    
  
  json_data = json.dumps(json_data)

  return HttpResponse("%s" % json_data)
	

@csrf_exempt
def ajax_upload_request(request):
  fg = NF_FG()
  val = ValidateNF_FG()
  if request.method == 'POST':
    print "post"
    

    directory = "users/upload@"+request.session["username"]
    if not os.path.exists(directory):
      os.makedirs(directory)

    # memorizzo filename e contenuto del file inviato dall'utente
    
    file_name_fg = request.POST["file_name_fg"]    
    content_file = request.POST["file_content_fg"]
    # memorizzo il filename nella varibile di sessione file_name


    json_data = json.loads(content_file)
    try:
      val.validate(json_data)
    except ValidationError as err:

      msg = "errore di validazione:" + err.message 
      print msg
      return HttpResponse("%s" % msg)



    (shortname, extension) = os.path.splitext(file_name_fg)


    if(extension == ".json"):

      print request.POST["file_name_fg"]
      print request.POST["file_content_fg"]
      
      out_file = open(directory+"/"+file_name_fg,"w")
      out_file.write(content_file)
      out_file.close()

      request.session["file_name_fg"] = file_name_fg;

      msg = "upload riuscito"
      return HttpResponse("%s" % msg)

    else:
      print "formato non valido"


    return HttpResponse("%s" % "post")
  elif request.method == 'GET':
    print "get"
    #form = NameForm(request.GET)
    print request.GET
    return HttpResponse("%s" % "get")


def ajax_files_request(request):
  if request.method == "GET":         #sostituire con metodo post
    directory = "users/upload@"+request.session["username"]
    dirs = os.listdir(directory)

    lista_file = []

    for file in dirs:
      (shortname, extension) = os.path.splitext(file)
      if extension == ".json":
        lista_file.append(file)
        json_data = json.dumps(lista_file)
      

    print json_data
  return HttpResponse("%s" % json_data)


@csrf_exempt
def ajax_save_request(request):
  fg = NF_FG()
  val = ValidateNF_FG()
  if request.method == "POST":
    
    directory = "users/upload@"+request.session["username"]

    file_name_fg = request.POST["file_name_fg"]
    file_name_pos = request.POST["file_name_pos"]

    file_content_fg = request.POST["file_content_fg"]
    file_content_pos = request.POST["file_content_pos"]

    # memorizzo il filename nella varibile di sessione file_name
    request.session["file_name_fg"] = file_name_fg;
    request.session["file_name_pos"] = file_name_pos;


    json_data = json.loads(file_content_fg)
    try:
      val.validate(json_data)
    except ValidationError as err:

      msg = "errore di validazione:" + err.message 
      print msg
      return HttpResponse("%s" % msg)


    (shortname, extension) = os.path.splitext(file_name_fg)

    if(extension == ".json"):

      out_file = open(directory+"/"+file_name_fg,"w")
      out_file.write(file_content_fg)
      out_file.close()

      out_file = open(directory+"/"+file_name_pos,"w")
      out_file.write(file_content_pos)
      out_file.close()

      return HttpResponse("%s" % "salvataggio riuscito")

    else:
      
      msg = "formato non valido"
      print msg
      

@csrf_exempt
def ajax_download_preview(request):
  if request.method == "POST":
    directory = "users/upload@"+request.session["username"]
    file_name_fg = request.POST["file_name_fg"]

    (shortname, extension) = os.path.splitext(file_name_fg)

    if(extension == ".json"):
      if os.path.isfile(directory+"/"+file_name_fg):
        print "file trovato"

        request.session["file_name_fg"] = file_name_fg

        json_file_fg = open(directory+"/"+file_name_fg,"r")
        json_data_fg = json.load(json_file_fg)      
        json_data = json.dumps(json_data_fg)

        print json_data
        return HttpResponse("%s" % json_data)

      else:
        print "file non trovato"
    else:
      print "formato file non valido"



@csrf_exempt
def ajax_download_request(request):
  fg = NF_FG()
  val = ValidateNF_FG()
  if request.method == "POST":
    directory = "users/upload@"+request.session["username"]
    file_name_fg = request.POST["file_name_fg"]

    print "ajax download request"
    (shortname, extension) = os.path.splitext(file_name_fg)

    if(extension == ".json"):
      if os.path.isfile(directory+"/"+file_name_fg):
        print "file trovato"

        

        json_file_fg = open(directory+"/"+file_name_fg,"r")
        json_data_fg = json.load(json_file_fg) 
        json_data = json.dumps(json_data_fg)

        try:
          val.validate(json_data_fg)
        except ValidationError as err:

          msg = "errore di validazione:" + err.message 
          print msg
          return HttpResponse("%s" % msg)


        request.session["file_name_fg"] = file_name_fg
        len_file_name = len(file_name_fg)
        file_name_pos = file_name_fg[0:len_file_name-5]
        file_name_pos += "_pos.json"
        print file_name_pos

        if os.path.isfile(directory+"/"+file_name_pos):
          print "file di posizionamento presente"
          request.session["file_name_pos"] = file_name_pos


        print json_data
        return HttpResponse("%s" % "salvataggio riuscito")

      else:
        print "file non trovato"
    else:
      print "formato file non valido"



