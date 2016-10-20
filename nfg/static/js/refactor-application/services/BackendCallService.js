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
                {'forwarding-graph': json_graph},
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
        }
        return {
            getAvailableGraphs: _getAvailableGraphs,
            getJSONSchema: _getJSONSchema,
            getTemplates: _getTemplates,
            getFRTableConfig: _getFRTableConfig,
            putGraph: _putGraph
        };
    };

    BackendCallService.$inject = ['$q', '$http'];

    angular.module('fg-gui').service('BackendCallService', BackendCallService);
})();
