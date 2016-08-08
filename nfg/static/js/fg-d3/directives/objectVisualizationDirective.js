/**
 * Created by giacomo on 05/08/16.
 */
(function () {

    var template =
        '<div class="form-group">' +
        '   <label class="control-label col-sm-2" for="vnfId">processor:</label>' +
        '   <div class="col-sm-10">' +
        '       <div class="form-group">' +
        '           <label class="col-sm-2 control-label" for="vnfId">ID:</label>' +
        '           <div class="col-sm-10">' +
        '               <input type="text" class="form-control" id="vnfId" name="idVNF" ng-model="VNFCtrl.fgElem.id" disabled="">' +
        '           </div>' +
        '       </div>' +
        '   </div>' +
        '</div>';

    var objectVisualization = function (RecursionHelper) {
        return {
            /**
             * type of angular directive (can be used via elment only)
             */
            restrict: "E",
            scope: {
                /**
                 * {object} Position object for the forwarding graph
                 */
                referenceObject: "="
            },
            templateUrl: '/static/js/fg-d3/directives/template/objectVisualizationTemplate.html',
            /**
             * Controller of the directive
             * @param $scope {object} Directive scope
             */
            controller: function ($scope) {
            },
            compile: function (element) {

                /**
                 * Directive linking function
                 * @param scope The scope of the directive
                 * @param element The element to which is bounded
                 * @param attributes The attributes of the element
                 * @param controller The controller linked to the directive (its controller. ngModelController)
                 */
                function link(scope, element, attributes, controller) {
                    scope.checkObj = function (val) {
                        return angular.isObject(val);
                    };
                    scope.hideComponent = false;
                }

                return RecursionHelper.compile(element, link);
            }
        };
    };
    objectVisualization.$inject = ["RecursionHelper"];
    angular.module("d3").directive("objectVisualization", objectVisualization);
})();