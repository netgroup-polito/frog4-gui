/**
 * Created by riccardodiomedi on 23/09/16.
 */
(function () {
    var containerDirective = function (RecursionHelper) {
        return {
            restrict: "E",
            scope: {
				level: "=",
                containerObject: "=",
                containerStateObject: "="
            },
            templateUrl: '/static/js/fg-d3/directives/template/containerTemplate.html',
            controller: function($scope){

                $scope.stateContainerHandler = function (modelObject, stateObject, stateVal) {
                    if (typeof(stateVal) != 'undefined') {
                        return stateVal;
                    }
                    if (typeof(stateObject) != 'undefined' /*&& typeof(modelObject) != 'undefined'*/) {
                        stateObject[modelObject['@name']] = {};
                        return stateObject[modelObject['@name']];
                    }
                };

                $scope.stateListHandler = function (modelObject, stateObject, stateVal) {
                    //console.log("stateObject", stateObject);
                    if (typeof(stateVal) != 'undefined') {
                        return stateVal;
                    }
                    if (typeof(stateObject) != 'undefined') {// && typeof(modelObject) != 'undefined'
                        stateObject[modelObject['@name']] = [];
                    }
                };

                $scope.stateLeafHandler = function (modelObject, stateObject) {
                    if (typeof(stateObject) != 'undefined') {
                        for (var i = 0; i < modelObject.length; i++) {
                            if (!stateObject.hasOwnProperty(modelObject[i]['@name'])) {
                                stateObject[modelObject[i]['@name']] = "test";
                            }
                        }
                    }
                    return stateObject;
                };

                $scope.panel = {
                    open: true
                };
                $scope.style = {
                	"background-color":"rgba(0, 191, 255, " + (0.03 + (0.06 * $scope.level )) + ")"
                }
            },
            compile: function (element) {
                function link(scope, element, attributes, controller) {
                    scope.checkArray = function (val) {
                        return angular.isArray(val);
                    };
                    scope.hideComponent = false;
                }
                return RecursionHelper.compile(element, link);
            }
        };
    };
    containerDirective.$inject = ["RecursionHelper"];
    angular.module("d3").directive("container", containerDirective);
})();
