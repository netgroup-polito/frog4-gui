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

        var _addRectDefinition = function (section, definitionName, offsetX, offsetY, width, height, css) {
            var def = section.append("defs").append("g").attr("id", definitionName);
            def.append("rect")
                .attr("x", offsetX)
                .attr("y", offsetY)
                .attr("width", width)
                .attr("height", height)
                .attr("class", css);
            return def;
        };

        /*var _addPatterDefinition = function (section, definitionName, offsetX, offsetY, width, height, css) {
            var def = section.append("defs").append("g").attr("id", definitionName);

            defs_section.append("defs")
                .append('pattern')
                .attr('id', 'host-select-icon')
                .attr('width', 1)
                .attr('height', 1)
                .attr('patternContentUnits', 'objectBoundingBox')
                .append("svg:image")
                .attr("xlink:xlink:href", "/static/img/pc-red.png")
                .attr('width', 1)
                .attr('height', 1)
                .attr("preserveAspectRatio", "xMinYMin slice");

            def.append("pattern")
                .attr("x", offsetX)
                .attr("y", offsetY)
                .attr("width", width)
                .attr("height", height)
                .attr("class", css);
            return def;
        };*/

        return {
            d3: _d3,
            initiateGraph: _initiateGraph,
            deleteGraph: _deleteGraph,
            addAttribute: _addAttribute,
            addSection: _addSection,
            addRectDefinition: _addRectDefinition
        };
    };

    d3Service.$inject = ['$document', '$q', '$rootScope'];

    angular.module('fg-gui').service('d3Service', d3Service);
})();