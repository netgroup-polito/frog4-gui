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
        var _addUser = function (username, password) {

        };
        var _deleteUser = function (username) {

        };

        var _getGroups = function () {
            var deferred = $q.defer();
            $http.get("/api/v1/users_api/get_group_list/").then(function (result) {
                deferred.resolve(result);
            }).fail(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        var _addGroups = function (groupname) {

        };

        var _deleteGroups = function (groupname) {

        };

        return {
            getUsers: _getUsers,
            getUser: _getUser,
            addUser: _addUser,
            deleteUser: _deleteUser,
            getGroups: _getGroups,
            addGroups: _addGroups,
            deleteGroups: _deleteGroups
        };
    };

    BackendCallService.$inject = ['$q', '$http'];

    angular.module('fg-gui').service('BackendCallService', BackendCallService);
})();