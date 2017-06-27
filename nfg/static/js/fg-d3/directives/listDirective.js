/**
 * Created by riccardodiomedi on 23/09/16.
 */
(function() {
    var listDirective = function () {
        return {
            restrict: "E",
            scope: {
                rootObject: "=",
                listStateObject: "=",
                listModel: "=",
                augmentObject: "="
            },
            templateUrl: '/static/js/fg-d3/directives/template/listTemplate.html',
            controller: function($scope){
                $scope.handleAugment = function (augm, state) {
                    if (!augm) {
                        return false;
                    }
                    var split = augm.when['@condition'].split("=");
                    if (state[split[0]] == split[1]) {
                        return true;
                    } else {
                        delete state[augm.leaf['@name']];
                        return false;
                    };
                }
            },
            link: function (scope, element, attrs, ngModel) {
                if (!scope.listStateObject) {
                    scope.listStateObject = [];
                }
            }
        };
    };
    angular.module("d3").directive("list", listDirective);
})();