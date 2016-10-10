/**
 * Created by riccardodiomedi on 01/10/16.
 */
(function() {
    /**
     * This directive is used in order to load a file form FileSystem
     * @param $parse
     * @returns {{restrict: string, scope: boolean, link: link}}
     */
    var onReadFile = function ($parse) {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element, attrs) {
                var fn = $parse(attrs.onReadFile);

                element.on('change', function(onChangeEvent) {
                    var reader = new FileReader();

                    reader.onload = function(onLoadEvent) {
                        scope.$apply(function() {
                            fn(scope, {$fileContent:onLoadEvent.target.result});
                        });
                    };

                    reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                });
            }
        };
    };
    onReadFile.$inject = ['$parse'];
    angular.module("d3").directive("onReadFile", onReadFile);
})();