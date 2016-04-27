from django.conf.urls import url

from . import views

urlpatterns = [url(r'^$', views.index, name='index'),
               url(r'^ajax_data_request/$', views.ajax_data_request, name='ajax_data_request'),
               url(r'^ajax_template_request/(?P<id_template>\w{0,15})/$', views.ajax_template_request, name='ajax_template_request'),
               url(r'^login/$', views.login, name='login'),
               url(r'^logout/$', views.logout, name='logout'),
               url(r'^ajax_upload_request/$', views.ajax_upload_request, name='ajax_upload_request'),
               url(r'^ajax_download_preview/$', views.ajax_download_preview, name='ajax_download_preview'),
               url(r'^ajax_download_request/$', views.ajax_download_request, name='ajax_download_request'),
               url(r'^ajax_files_request/$', views.ajax_files_request, name='ajax_files_request'),
               url(r'^ajax_save_request/$', views.ajax_save_request, name='ajax_save_request'),
               url(r'^info/$', views.info, name='info'),
               url(r'^deploy/$', views.deploy, name='deploy'),
               url(r'^users/$', views.users, name='users'),
               url(r'^api/v1/users_api/get_user_list/$', views.api_get_user_list, name='get_user_list'),
               url(r'^api/v1/users_api/get_group_list/$', views.api_get_group_list, name='get_group_list')

               ]
