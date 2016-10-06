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
                /*
                $scope.stateLeafHandler = function (modelList, stateList) {
                    //all this should happen iff the state of vnf is undefined
                    var stateLeafs = {};
                    for (var i = 0; i < modelList.leaf.length; i++) {
                        stateLeafs[modelList.leaf[i]['@name']] = ""; //initialize the object
                    }
                    if (stateList.length == 0) {
                        stateList.push(stateLeafs);
                    }
                }
                */
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