from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.refactor, name='refactor'),
    url(r'^old', views.index, name='old'),
    url(r'^ajax_data_request/$', views.ajax_data_request, name='ajax_data_request'),


    url(r'^status/get_vnf_model/(?P<vnf_type>dhcp_cfg|nat_cfg|firewall_cfg)$', views.status_get_vnf_model, name='status_get_vnf_model'),
    url(r'^configure/get_vnf_state/(?P<mac_address>([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2}))/user/(?P<username>.*)$', views.configure_get_vnf_state, name='configure_get_vnf_state'),
    url(r'^configure/put_vnf_updated_state/(?P<mac_address>([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2}))/user/(?P<username>.*)$', views.configure_put_vnf_updated_state, name='configure_put_vnf_updated_state'),
    
    url(r'^ajax_template_request/(?P<id_template>\w{0,15})/$', views.ajax_template_request, name='ajax_template_request'),
    url(r'^login/$', views.login, name='login'),
    url(r'^logout/$', views.logout, name='logout'),
    url(r'^ajax_upload_request/$', views.ajax_upload_request, name='ajax_upload_request'),
    url(r'^ajax_download_preview/$', views.ajax_download_preview, name='ajax_download_preview'),
    url(r'^ajax_download_request/$', views.ajax_download_request, name='ajax_download_request'),
    url(r'^ajax_files_request/$', views.ajax_files_request, name='ajax_files_request'),
    url(r'^ajax_save_request/$', views.ajax_save_request, name='ajax_save_request'),
    url(r'^view_templates_request/$', views.view_templates_request, name='view_templates_request'),
    url(r'^view_match_request/$', views.view_match_request, name='view_match_request'),
    url(r'^view_action_request/$', views.view_action_request, name='view_action_request'),
    url(r'^view_ep_request/$', views.view_ep_request, name='view_ep_request'),
    url(r'^info/$', views.info, name='info'),
    #url(r'^deploy/$', views.deploy, name='deploy'),

    url(r'^users/$', views.users, name='users'),

    url(r'^api/v1/users_api/get_user_list/$', views.api_get_user_list, name='get_user_list'),
    url(r'^api/v1/users_api/add_user/$', views.api_add_user, name='add_user'),
    url(r'^api/v1/users_api/delete_user/$', views.api_delete_user, name='delete_user'),
    url(r'^api/v1/users_api/get_group_list/$', views.api_get_group_list, name='get_group_list'),
    url(r'^api/v1/users_api/add_group/$', views.api_add_group, name='add_group'),
    url(r'^api/v1/users_api/delete_group/$', views.api_delete_group, name='delete_group'),

    url(r'^api/v1/graphs_api/get_available_graphs/$', views.api_get_available_graphs, name='get_available_graphs'),
    # url(r'^api/v1/graphs_api/get_available_graphs/$', views.api_get_available_graphs_debug, name='get_available_graphs'),
    url(r'^api/v1/graphs_api/get_json_schema/$', views.api_get_json_schema, name='get_json_schema'),
    url(r'^api/v1/graphs_api/get_fr_table_config', views.api_get_fr_table_config, name='get_fr_table_config'),
    url(r'^api/v1/graphs_api/put_graph/$', views.api_put_graph, name='put_graph'),
    url(r'^api/v1/graphs_api/get_vnf_templates/$', views.api_get_vnf_templates, name='get_vnf_templates'),
    url(r'^graphs_from_repository_request/$', views.graphs_from_repository_request,
        name='graphs_from_repository_request')

]
