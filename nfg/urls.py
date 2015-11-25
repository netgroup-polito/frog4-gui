from django.conf.urls import url

from .import views

urlpatterns = [url(r'^$',views.index,name='index'),
			   url(r'^ajax_data_request/$',views.ajax_data_request,name='ajax_data_request'),
			   url(r'^ajax_template_request/$',views.ajax_template_request,name='ajax_template_request'),
			   url(r'^login/$',views.login,name='login'),
			   url(r'^logout/$',views.logout,name='logout'),
]