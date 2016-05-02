/**
 * Created by giacomo on 18/04/16.
 */
(function () {
    'use strict';
    var BackendCallService = function ($q, $http) {
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