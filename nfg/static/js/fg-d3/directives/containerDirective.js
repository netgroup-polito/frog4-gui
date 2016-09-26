/**
 * Created by riccardodiomedi on 23/09/16.
 */
(function () {
    var containerDirective = function (RecursionHelper) {
        return {
            restrict: "E",
            scope: {
                containerObject: "=",
                containerStateObject: "="
            },
            templateUrl: '/static/js/fg-d3/directives/template/containerTemplate.html',
            controller: function($scope){
                $scope.panel = {
                    open: true
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
