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

                $scope.stateListHandler = function (state, list) {
                    if (typeof(state[list['@name']]) == 'undefined') {
                        state[list['@name']] = [];
                    };
                    return state[list['@name']];
                };

                $scope.stateLeafHandler = function (state, leaf) {
                    if (typeof(state[leaf['@name']]) == 'undefined') {
                        state[leaf['@name']] = "test";
                    }
                    return state;
                };

                $scope.stateContainerHandler = function (state, container) {
                    if (typeof(state[container['@name']]) == 'undefined') {
                        state[container['@name']] = {};
                    }
                    return state[container['@name']]
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
