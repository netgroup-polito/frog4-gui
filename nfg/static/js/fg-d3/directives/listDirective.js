/**
 * Created by riccardodiomedi on 23/09/16.
 */
(function() {
    var listDirective = function () {
        return {
            restrict: "E",
            scope: {
                listStateObject: "=",
                listModel: "="
            },
            templateUrl: '/static/js/fg-d3/directives/template/listTemplate.html',
            link: function (scope, element, attrs, ngModel) {
            }
        };
    };
    angular.module("d3").directive("list", listDirective);
})();