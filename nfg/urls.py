from django.conf.urls import url

from .import views

urlpatterns = [url(r'^$',views.index,name='index'),
			   url(r'^ajax_data_request/$',views.ajax_data_request,name='ajax_data_request'),
			   url(r'^ajax_template_request/(?P<id_template>\w{0,15})/$',views.ajax_template_request,name='ajax_template_request'),
			   url(r'^login/$',views.login,name='login'),
			   url(r'^logout/$',views.logout,name='logout'),
			   url(r'^ajax_upload_request/$',views.ajax_upload_request,name='ajax_upload_request'),
			   url(r'^ajax_files_request/$',views.ajax_files_request,name='ajax_files_request'),
			   url(r'^ajax_save_request/$',views.ajax_save_request,name='ajax_save_request')
]