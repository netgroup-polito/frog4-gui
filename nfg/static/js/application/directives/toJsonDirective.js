/**
 * Created by luigi on 14/12/16.
 */
(function () {

    var toJsonDirective = function ($filter) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelController) {
                ngModelController.$parsers.push(function (data) {
                    try {
                        var json_obj = JSON.parse(data);
                        ngModelController.$setValidity('jsonError', true);
                        return json_obj;
                    } catch (err) {
                        ngModelController.$setValidity('jsonError', false);
                        return data;
                    }
                });

                ngModelController.$formatters.push(function (json_obj) {
                    ngModelController.$setValidity('jsonError', null);
                    var data = $filter('json')(json_obj);
                    return data;
                });
            }
        }
    };

    toJsonDirective.$inject = ["$filter"];
    angular.module('fg-gui').directive('toJsonDirective', toJsonDirective);
})();
