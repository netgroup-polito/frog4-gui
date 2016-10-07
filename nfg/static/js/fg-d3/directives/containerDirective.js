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

                    if (!scope.containerStateObject) {
                        scope.containerStateObject = {};
                    }

                    if (scope.containerObject) {
                        scope.containerName = scope.containerObject['@name'];
                    }

                    if (scope.containerObject && scope.containerObject.description) { // se c'è description
                        var text = scope.containerObject.description.text;
                        var split = text.split(",");
                        for (var i = 0; i < split.length; i++) {

                            if (split[i].indexOf('name=') != -1) {
                                var split2 = split[i].split("=");
                                scope.containerName = split2[1].replace(/[']/g, "");
                            }
                        }
                    }
                }
                return RecursionHelper.compile(element, link);
            }
        };
    };
    containerDirective.$inject = ["RecursionHelper"];
    angular.module("d3").directive("container", containerDirective);
})();
