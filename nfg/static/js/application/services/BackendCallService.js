/**
 * Created by giacomo on 18/04/16.
 */
(function () {
    'use strict';
    var BackendCallService = function ($q, $http) {

        /**
         * Function to get all the available graph, from the repository/orchestrator
         * @returns {Promise} Promise fulfilled with the result of the http request.
         * @private
         */
        var _getAvailableGraphs = function () {
            var deferred = $q.defer();

            $http.get("api/v1/graphs_api/get_available_graphs/")
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        };

        var _getJSONSchema = function () {
            var deferred = $q.defer();
            $http.get("api/v1/graphs_api/get_json_schema/")
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        //TODO Delete
        var _getTemplates = function () {
            var deferred = $q.defer();
            $http.get("api/v1/graphs_api/get_vnf_templates/")
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        var _getFRTableConfig = function () {
            var deferred = $q.defer();
            $http.get("api/v1/graphs_api/get_fr_table_config/")
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        var _putGraph = function (json_graph) {
            var put_graph_path = '/api/v1/graphs_api/put_graph/';
            if (typeof json_graph['forwarding-graph']['id'] !== 'undefined'){
                var graph_id = json_graph['forwarding-graph']['id'];
                put_graph_path = "/api/v1/graphs_api/put_graph/" + graph_id;
                delete json_graph['forwarding-graph']['id'];
            }
            var deferred = $q.defer();
            $http.put(put_graph_path , json_graph,
                {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        var _deleteGraph = function (graph_id) {
            var deferred = $q.defer();
            $http.delete("/api/v1/graphs_api/delete_graph/" + graph_id,
                {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        var _getVNFModel = function (graphId, vnfIdentifier, tenantId, templateUri) {
            var deferred = $q.defer();
            var url = "api/v1/config_api/get_vnf_model/" + tenantId + "/" + graphId + "/" + vnfIdentifier;
            if(typeof templateUri !== 'undefined' && templateUri != "")
                url += "?templateuri=" + templateUri;
            $http.get(url) //get the yang model here
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        var _getVNFState = function (graphId, vnfIdentifier, tenantId) {
            //some input controller put here
            var url = "api/v1/config_api/get_vnf_state/" + tenantId + "/" + graphId + "/" + vnfIdentifier;
            var deferred = $q.defer();
            $http.get(url) //get the state here
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        var _putStateVNF = function (graphId, vnfIdentifier, tenantId, updatedStateVNF) {
            var deferred = $q.defer();
            var url = "api/v1/config_api/put_vnf_state/" + tenantId + "/" + graphId + "/" + vnfIdentifier;
            $http.put(url, updatedStateVNF) //send data to the server here
                .then(
                    function (data) {
                        deferred.resolve(data);
                    },
                    function (error) {
                        deferred.reject(error);
                    }
                );
            return deferred.promise;
        };

        var _getVNFList = function () {
            var deferred = $q.defer();
            $http.get("api/v2/datastore_api/get_vnf_list/")
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        var _putVNFTemplate = function (json_template, image_upload_status) {
            var deferred = $q.defer();
            $http.put("api/v2/datastore_api/put_vnf_template/",
                {
                    'template': json_template,
                    'image-upload-status': image_upload_status
                },
                {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        var _updateVNFTemplate = function (vnf_id, json_template) {
            var deferred = $q.defer();
            $http.put("api/v2/datastore_api/put_vnf_template/" + vnf_id + "/",
                json_template,
                {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        var _deleteVNF = function (vnf_id) {
            var deferred = $q.defer();
            $http.delete("api/v2/datastore_api/delete_vnf/" + vnf_id + "/")
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        var _getRepoAddress = function () {
            var deferred = $q.defer();
            $http.get("api/v2/datastore_api/get_datastore_address/")
                .success(function (result) {
                    deferred.resolve(result);
                });
            return deferred.promise;
        };

        var _getAvailableGraphsFromRepo = function() {
            var deferred = $q.defer();
            $http.get("api/v2/datastore_api/get_available_graphs/")
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        var _getGraphFromRepo = function(graph_id) {
            var deferred = $q.defer();
            $http.get("api/v2/datastore_api/get_graph/" + graph_id + "/")
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        var _putGraphOnRepo = function(json_graph, graph_id) {
            var put_graph_path = 'api/v2/datastore_api/put_graph/';
            if (graph_id !== null){
                put_graph_path = "api/v2/datastore_api/put_graph/" + graph_id + "/";
            }
            var deferred = $q.defer();
            $http.put(put_graph_path,
                json_graph,
                {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        var _deleteGraphFromRepo = function(graph_id) {
            var deferred = $q.defer();
            $http.delete("api/v2/datastore_api/delete_graph/" + graph_id['graph_id_datastore'] + "/")
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        var _getUsers = function () {
            var deferred = $q.defer();
            $http.get("/api/v1/users_api/get_user_list/").success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var _getUser = function (username) {

        };

        var _addUser = function (user) {
            var deferred = $q.defer();
            $http.post("/api/v1/users_api/add_user/",
                user,
                {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        var _deleteUser = function (user) {
            var deferred = $q.defer();
            $http.delete("/api/v1/users_api/delete_user/",
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    data :user
                })
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        var _getGroups = function () {
            var deferred = $q.defer();
            $http.get("/api/v1/users_api/get_group_list/").success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var _addGroup = function (group) {
            var deferred = $q.defer();
            $http.put("/api/v1/users_api/add_group/",
                group,
                {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        var _deleteGroup = function (group) {
            var deferred = $q.defer();
            $http.delete("/api/v1/users_api/delete_group/",
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    data :group
                })
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        return {
            getAvailableGraphs: _getAvailableGraphs,
            getJSONSchema: _getJSONSchema,
            //getTemplates: _getTemplates,
            getFRTableConfig: _getFRTableConfig,
            putGraph: _putGraph,
            deleteGraph: _deleteGraph,
            getVNFModel: _getVNFModel,
            getVNFState: _getVNFState,
            putStateVNF: _putStateVNF,
            getVNFList: _getVNFList,
            putVNFTemplate: _putVNFTemplate,
            updateVNFTemplate: _updateVNFTemplate,
            deleteVNF: _deleteVNF,
            getRepoAddress: _getRepoAddress,
            getAvailableGraphsFromRepo: _getAvailableGraphsFromRepo,
            getGraphFromRepo: _getGraphFromRepo,
            putGraphOnRepo: _putGraphOnRepo,
            deleteGraphFromRepo: _deleteGraphFromRepo,
            getUsers: _getUsers,
            getUser: _getUser,
            addUser: _addUser,
            deleteUser: _deleteUser,
            getGroups: _getGroups,
            addGroup: _addGroup,
            deleteGroup: _deleteGroup
        };
    };

    BackendCallService.$inject = ['$q', '$http'];

    angular.module('fg-gui').service('BackendCallService', BackendCallService);
})();
