/**
 * Created by davidexx92 on 27/06/17.
 */
(function() {
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
                scope.optionList = []
                //ng-options="en['@name'] as en['@name'] for en in loptions"
            }
        };
    };
    angular.module("d3").directive("leafref", leafrefDirective);
})();
