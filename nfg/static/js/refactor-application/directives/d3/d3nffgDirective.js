/**
 * Created by giacomo on 06/05/16.
 */
(function () {
    var d3nffg = function () {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                
            }
        };
    };

    angular.module("fg-gui").directive("d3nffg",d3nffg);

})();