from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='refactor'),
    url(r'^api/v1/config_api/get_vnf_model/(?P<tenant_id>[^/]+)/(?P<graph_id>[^/]+)/(?P<vnf_identifier>[^/]+)$', views.status_get_vnf_model, name='status_get_vnf_model'),
    url(r'^api/v1/config_api/get_vnf_state/(?P<tenant_id>[^/]+)/(?P<graph_id>[^/]+)/(?P<vnf_identifier>[^/]+)$', views.configure_get_vnf_state, name='configure_get_vnf_state'),
    url(r'^api/v1/config_api/put_vnf_state/(?P<tenant_id>[^/]+)/(?P<graph_id>[^/]+)/(?P<vnf_identifier>[^/]+)$', views.configure_put_vnf_updated_state, name='configure_put_vnf_updated_state'),

    url(r'^login/$', views.login, name='login'),
    url(r'^logout/$', views.logout, name='logout'),

    url(r'^api/v1/users_api/get_user_list/$', views.api_get_user_list, name='get_user_list'),
    url(r'^api/v1/users_api/add_user/$', views.api_add_user, name='add_user'),
    url(r'^api/v1/users_api/delete_user/$', views.api_delete_user, name='delete_user'),
    url(r'^api/v1/users_api/get_group_list/$', views.api_get_group_list, name='get_group_list'),
    url(r'^api/v1/users_api/add_group/$', views.api_add_group, name='add_group'),
    url(r'^api/v1/users_api/delete_group/$', views.api_delete_group, name='delete_group'),

    url(r'^api/v1/graphs_api/get_available_graphs/$', views.api_get_available_graphs, name='get_available_graphs'),
    url(r'^api/v1/graphs_api/get_json_schema/$', views.api_get_json_schema, name='get_json_schema'),
    url(r'^api/v1/graphs_api/get_fr_table_config', views.api_get_fr_table_config, name='get_fr_table_config'),
    url(r'^api/v1/graphs_api/post_graph/$', views.api_post_graph, name='post_graph'),
    url(r'^api/v1/graphs_api/put_graph/(?P<graph_id>[^/]+)$', views.api_put_graph, name='put_graph'),
    url(r'^api/v1/graphs_api/delete_graph/(?P<graph_id>[^/]+)$', views.api_delete_graph, name='delete_graph'),
    #url(r'^api/v1/graphs_api/get_vnf_templates/$', views.api_get_vnf_templates, name='get_vnf_templates'),

    url(r'^api/v2/datastore_api/get_vnf_list/$', views.api_get_vnf_list, name='get_vnf_list'),
    url(r'^api/v2/datastore_api/put_vnf_template/$', views.api_put_vnf_template, name='put_vnf_template'),
    url(r'^api/v2/datastore_api/put_vnf_template/(?P<vnf_id>[^/]+)/$', views.api_update_vnf_template, name='update_vnf_template'),
    url(r'^api/v2/datastore_api/delete_vnf/(?P<vnf_id>[^/]+)/$', views.api_delete_vnf, name='delete_vnf'),
    url(r'^api/v2/datastore_api/get_datastore_address/$', views.api_get_datastore_address, name='get_datastore_address'),

    url(r'^api/v2/datastore_api/get_available_graphs/$', views.api_get_available_graphs_from_repo, name='get_available_graphs_from_repo'),
    url(r'^api/v2/datastore_api/get_graph/(?P<graph_id>[^/]+)/$', views.api_get_graph_from_repo, name='get_graph_from_repo'),
    url(r'^api/v2/datastore_api/put_graph/$', views.api_put_graph_on_repo, name='put_graph_on_repo'),
    url(r'^api/v2/datastore_api/put_graph/(?P<graph_id>[^/]+)/$', views.api_update_graph_on_repo, name='update_graph_on_repo'),
    url(r'^api/v2/datastore_api/delete_graph/(?P<graph_id>[^/]+)/$', views.api_delete_graph_from_repo, name='delete_graph_from_repo')
]