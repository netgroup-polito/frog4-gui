/**
 * Created by riccardodiomedi on 23/09/16.
 */
(function() {
    var leafDirective = function () {
        return {
            restrict: "E",
            scope: {
                rootObject: "=",
                leafObject: "=",
                stateObject: "="
            },
            templateUrl: '/static/js/fg-d3/directives/template/leafTemplate.html',
            controller: function ($scope) {
            },
            link: function (scope, element, attrs, ngModel) {
                if (!scope.stateObject) {
                    scope.stateObject = "";
                }
                /**
                 * Check the different fields in description statement
                 */
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
                    }
                }

                //List initialization for type boolean, booleanValues[0] (false) is set as default value
                scope.booleanValues = [{ "value": false, "text": "false" }, { "value": true, "text": "true" }];
            }
        };
    };
    angular.module("d3").directive("leaf", leafDirective);
})();
