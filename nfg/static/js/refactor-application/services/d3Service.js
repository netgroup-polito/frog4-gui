/**
 * Created by giacomo on 06/05/16.
 */
(function () {
    "use strict";
    var d3Service = function ($document, $q, $rootScope) {

        var d3 = window.d3;


        var _d3 = function () {
            return d3;
        };


        var _deleteGraph = function (id) {
            if (d3) {
                d3.select(id).remove();
                return true;
            } else {
                return false;
            }
        };

        var _initiateGraph = function (id) {
            if (d3) {
                return d3.select(id).append("svg");
            } else {
                return false;
            }
        };

        var _addAttribute = function (svg, prop, value) {
            return svg.attr(prop, value)
        };

        var _addSection = function (svg, sectionName) {
            return svg.append("g").attr("class", sectionName);
        };

        return {
            d3: _d3,
            initiateGraph: _initiateGraph,
            deleteGraph: _deleteGraph,
            addAttribute: _addAttribute,
            addSection: _addSection
        };
    };

    d3Service.$inject = ['$document', '$q', '$rootScope'];

    angular.module('fg-gui').service('d3Service', d3Service);
})();