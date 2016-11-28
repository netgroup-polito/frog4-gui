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
            var deferred = $q.defer();
            $http.put("/api/v1/graphs_api/put_graph/",
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

        var _deleteGraph = function (graph_id) {
            var deferred = $q.defer();
            $http.delete("/api/v1/graphs_api/delete_graph/"+graph_id,
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

        var _getYangModelVNF = function (vnfType) {
            var deferred = $q.defer();
            var url;
            if (vnfType == "dhcp") {
                url = "status/get_vnf_model/dhcp_cfg";
            } else if (vnfType == "nat") {
                url = "status/get_vnf_model/nat_cfg";
            } else if (vnfType == "firewall") {
                url = "status/get_vnf_model/firewall_cfg";
            }
            $http.get(url) //get the yang model here
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        var _getStateVNF = function (vnfMac, username) {
            //some input controller put here
            var url = "configure/get_vnf_state/" + vnfMac + "/user/" + username;
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

        var _putStateVNF = function (vnfMac, username, updatedStateVNF) {
            var deferred = $q.defer();
            var url = "configure/put_vnf_updated_state/" + vnfMac + "/user/" + username;
            $http.put(url, updatedStateVNF) //send data to the server here
                .then(
                    function (data) {
                        console.log("Post successed", data);
                        deferred.resolve(data);
                    },
                    function (error) {
                        console.log("Post failed: ", error);
                        deferred.reject(error);
                    }
                );
            return deferred.promise;
        };

        return {
            getAvailableGraphs: _getAvailableGraphs,
            getJSONSchema: _getJSONSchema,
            getTemplates: _getTemplates,
            getFRTableConfig: _getFRTableConfig,
            putGraph: _putGraph,
            deleteGraph: _deleteGraph,
            getYangModelVNF: _getYangModelVNF,
            getStateVNF: _getStateVNF,
            putStateVNF: _putStateVNF
        };
    };

    BackendCallService.$inject = ['$q', '$http'];

    angular.module('fg-gui').service('BackendCallService', BackendCallService);
})();
