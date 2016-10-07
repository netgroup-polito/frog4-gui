/**
 * Created by riccardodiomedi on 07/10/16.
 */
(function() {
    var dynamicAttribute = function () {
        return {
            scope: {
                list: '=dynAttr'
            },
            link: function(scope, elem, attrs){
                for(var attr in scope.list){
                    elem.attr(scope.list[attr].attr, scope.list[attr].value);
                }
            }
        };
    };
    angular.module("d3").directive("dynAttr", dynamicAttribute);
})();
