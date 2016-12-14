/**
 * Created by luigi on 14/12/16.
 */
(function () {

    var toJsonDirective = function ($filter) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelController) {
                ngModelController.$parsers.push(function (data) {
                    var json_obj = JSON.parse(data);
                    return json_obj;
                });

                ngModelController.$formatters.push(function (json_obj) {
                    var data = $filter('json')(json_obj);
                    return data;
                });
            }
        }
    };

    toJsonDirective.$inject = ["$filter"];
    angular.module('fg-gui').directive('toJsonDirective', toJsonDirective);
})();
