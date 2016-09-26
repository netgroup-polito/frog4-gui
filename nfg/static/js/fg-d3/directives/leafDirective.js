/**
 * Created by riccardodiomedi on 23/09/16.
 */
(function() {
    var leafDirective = function () {
        return {
            restrict: "E",
            scope: {
                leafObject: "=",
                stateObject: "="
            },
            templateUrl: '/static/js/fg-d3/directives/template/leafTemplate.html',
            link: function (scope, element, attrs, ngModel) {
            }
        };
    };
    angular.module("d3").directive("leaf", leafDirective);
})();
