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
            controller: function ($scope) {
                /**
                 * If the description statement is present, check the existence of field name
                 * @param text
                 * @returns {boolean}
                 */
                $scope.isThereName = function (text) {
                    var split = text.split(",");
                    for (var i = 0; i < split.length; i++) {
                        if (split[i].indexOf('name=') != -1) {
                            console.log(split[i]);
                            var split2 = split[i].split("=");
                            $scope.yName = split2[1].replace(/[']/g, "");
                            return true;
                        }
                    }
                    return false;
                }
            },
            link: function (scope, element, attrs, ngModel) {
                if (!scope.stateObject) {
                    scope.stateObject = "";
                }
                /**
                 * Check the different fields in description statement
                 */
                scope.leafName = scope.leafObject['@name'];

                if (scope.leafObject.description) {
                    var text = scope.leafObject.description.text;
                    scope.attrs = [];
                    var split = text.split(",");
                    for (var i = 0; i < split.length; i++) {
                        if (split[i].indexOf('readonly') != -1) {
                            scope.attrs.push({attr: 'disabled', value: 'true'});
                        }
                        if (split[i].indexOf('tooltip') != -1) {
                            var split2 = split[i].split("=");
                            var tip = split2[1].replace(/[']/g, "");
                            scope.attrs.push({attr: 'uib-popover', value: tip});
                            scope.attrs.push({attr: 'popover-trigger', value: "'focus'"});
                        }
                        if (split[i].indexOf('name=') != -1) {
                            var split2 = split[i].split("=");
                            scope.leafName = split2[1].replace(/[']/g, "");
                        }
                    }
                }
            }
        };
    };
    angular.module("d3").directive("leaf", leafDirective);
})();
