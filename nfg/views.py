import logging
import json
import requests
import os.path
import os

from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import RequestContext, loader

from django.contrib.auth import authenticate

from nffg_library.nffg import NF_FG
from vnf_template_library.template import Template

from pprint import pprint
from django.views.decorators.csrf import csrf_exempt

#from .forms import UploadFileForm

#from .forms import NameForm

def index(request):
	if "username" not in request.session:
		return HttpResponseRedirect("/nfg/login/")
	else:		
		return render(request,'nfg/index.html',{'username':request.session['username']})

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
    #template_1 = Template()
    #template_1.parseDict(json_data)

    print(json_data)

  return HttpResponse("%s" % json_data)

	

def ajax_data_request(request):

  directory = "users/upload@"+request.session["username"]
  print directory

  if "file_name" in request.session:
    file_name = request.session["file_name"]
  else:
    file_name = "default.json"
    request.session["file_name"] = file_name
  
  print file_name
  (shortname, extension) = os.path.splitext(file_name)

  print extension
  nffg_dict_1 = {}
  print directory+"/"+file_name
  if(extension == ".json"):
    if os.path.isfile(directory+"/"+file_name):
      print "file trovato"
      json_file = open(directory+"/"+file_name,"r")

      json_data = json.load(json_file)
      json_data = json.dumps(json_data)
      json_file.close()

      print(json_data)
      nffg_dict_1 = json_data

    else:
      print "file non trovato"


  else:
    print "formato file non valido"
    
	
  return HttpResponse("%s" % nffg_dict_1)
	

@csrf_exempt
def ajax_upload_request(request):
  if request.method == 'POST':
    #form = UploadFileForm(request.POST,request.FILES)
    #print(request.FILES['file'])
    print "post"
    

    directory = "users/upload@"+request.session["username"]
    if not os.path.exists(directory):
      os.makedirs(directory)

    # memorizzo filename e contenuto del file inviato dall'utente
    file_name = request.POST["file_name"]    
    content_file = request.POST["file"]
    # memorizzo il filename nella varibile di sessione file_name
    request.session["file_name"] = file_name


    (shortname, extension) = os.path.splitext(file_name)


    if(extension == ".json"):

      print request.POST["file_name"]
      print request.POST["file"]
      
      out_file = open(directory+"/"+file_name,"w")
      out_file.write(content_file)
      out_file.close()

      return HttpResponse("%s" % content_file)

    else:
      print "formato non valido"




    return HttpResponse("%s" % "post")
  elif request.method == 'GET':
    print "get"
    #form = NameForm(request.GET)
    print request.GET
    return HttpResponse("%s" % "get")


def ajax_files_request(request):
  if request.method == "GET":
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

