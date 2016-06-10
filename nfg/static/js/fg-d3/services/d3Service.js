/**
 * Created by giacomo on 06/05/16.
 */
(function () {
    "use strict";
    var d3Service = function () {

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

        var _addSimpleDefinition = function (section, type, attrsObject) {
            var def = section.append("defs");
            def.append(type)
                .attr(attrsObject);
            return def;
        };
        var _addNestedDefinition = function (section, type, attrsObject) {
            var children = attrsObject.children;
            delete attrsObject.children;
            var def = section.append("defs")
                .append(type).attr(attrsObject);
            if (children && children.length > 0)
                children.forEach(function (child) {
                    var type = child.type;
                    delete child.type;
                    _addNest(def, type, child)
                })
        };
        var _addNest = function (definition, type, attrsObject) {
            var children = attrsObject.children;
            delete attrsObject.children;
            var def = definition.append(type).attr(attrsObject);
            if (children && children.length > 0)
                children.forEach(function (child) {
                    var type = child.type;
                    delete child.type;
                    _addNest(def, type, child)
                })
        };


        return {
            d3: _d3,
            initiateGraph: _initiateGraph,
            deleteGraph: _deleteGraph,
            addAttribute: _addAttribute,
            addSection: _addSection,
            addSimpleDefinition: _addSimpleDefinition,
            addNestedDefinition: _addNestedDefinition
        };
    };

    d3Service.$inject = ['$document', '$q', '$rootScope'];

    angular.module('d3').service('d3Service', d3Service);
})();