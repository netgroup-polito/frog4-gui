/**
 * Created by davidexx92 on 27/06/17.
 */
(function () {
    'use strict';
    var leafrefDirective = function () {
        return {
            restrict: "E",
            scope: {
                rootObject: "=",
                leafrefString: "=",
                stateString: "="
            },
            templateUrl: '/static/js/fg-d3/directives/template/leafrefTemplate.html',
            controller: function ($scope) {
            },
            link: function (scope, element, attrs, ngModel) {
                if (!scope.stateObject) {
                    scope.stateObject = "";
                }
                /**
                 * Check the different fields in description statement
                 */
                var updateList = function () {
                    var opts = [];

                    var pathPieces = scope.leafrefString.split('/');

                    var recursion = function (splitPath, index, object) {
                        if (object === null || object === undefined) {
                            return;
                        }
                        if (splitPath[index] == "") {
                            index++;
                            for (var key in object) {
                                if (object.hasOwnProperty(key)) {
                                    var suf = key.split(':')[1];
                                    if (suf === splitPath[index]) {
                                        return recursion(splitPath, index + 1, object[key])
                                    }
                                }
                            }
                            console.log("no root");
                            return;
                        } else {
                            if (angular.isArray(object)) {
                                for (var i = 0; i < object.length; i++) {
                                    recursion(splitPath, index, object[i]);
                                }
                            } else if (angular.isObject(object)) {
                                recursion(splitPath, index + 1, object[splitPath[index]]);
                            } else {
                                opts.push(object);
                                return;
                            }

                        }
                    };
                    recursion(pathPieces, 0, scope.rootObject);

                    return opts;
                };
                scope.optionList = [];
                scope.$watch(function () {
                    return scope.rootObject;
                }, function () {
                    scope.optionList = updateList();
                });
            }
        };
    };
    angular.module("d3").directive("leafref", leafrefDirective);
})();
