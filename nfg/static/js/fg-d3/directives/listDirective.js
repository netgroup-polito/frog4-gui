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
            controller: function($scope){
            },
            link: function (scope, element, attrs, ngModel) {
                if (!scope.listStateObject) {
                    scope.listStateObject = [];
                }
                scope.listName = scope.listModel['@name'];

                if (scope.listModel.description) { // se c'è description
                    var text = scope.listModel.description.text;
                    var split = text.split(",");
                    for (var i = 0; i < split.length; i++) {

                        if (split[i].indexOf('name=') != -1) {
                            var split2 = split[i].split("=");
                            scope.listName = split2[1].replace(/[']/g, "");
                        }
                    }
                }
            }
        };
    };
    angular.module("d3").directive("list", listDirective);
})();