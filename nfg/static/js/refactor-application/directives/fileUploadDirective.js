/**
 * Created by giacomo on 13/08/16.
 */
(function () {

    var fileReader = function ($q) {
        var slice = Array.prototype.slice;

        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return;

                ngModel.$render = function () {
                };

                element.bind('change', function (e) {
                    var element = e.target;

                    $q.all(slice.call(element.files, 0).map(readFile))
                        .then(function (values) {
                            if (element.multiple)
                                ngModel.$setViewValue(values);
                            else
                                ngModel.$setViewValue(values.length ? values[0] : null);
                        });

                    function readFile(file) {
                        var deferred = $q.defer();

                        var reader = new FileReader();
                        reader.onload = function (e) {
                            deferred.resolve(JSON.parse(e.target.result));
                        };
                        reader.onerror = function (e) {
                            deferred.reject(e);
                        };
                        reader.readAsText(file);

                        return deferred.promise;
                    }

                }); //change

            } //link
        }; //return
    };

    fileReader.$inject = ["$q"];

    angular.module('fg-gui').directive('filereader', fileReader);
})();
