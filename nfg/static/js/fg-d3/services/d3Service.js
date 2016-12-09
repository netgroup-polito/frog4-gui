/**
 * Created by giacomo on 06/05/16.
 */
(function () {
    "use strict";
    /**
     * Service encapsulating part of the d3 library functionality
     * @returns {{d3: _d3, initiateGraph: _initiateGraph, deleteGraph: _deleteGraph, addAttribute: _addAttribute, addSection: _addSection, addSimpleDefinition: _addSimpleDefinition, addNestedDefinition: _addNestedDefinition, addDragBehavior: _addDragBehavior}}
     */
    var d3Service = function () {

        var d3 = window.d3;

        /**
         * Function to get the d3 library instance
         * @returns {*} The d3 instance
         * @private
         */
        function _d3() {
            return d3;
        }

        /**
         * Function to delete an svg graph based on the id of the HTML element or it's related object
         * @param id {string/object} Id of the HTML element or it's related object containing the graph to be removed (Ex: "#graph","#svg")
         * @returns {boolean} return if false if it's not ready the library
         * @private
         */
        function _deleteGraph(id) {
            if (d3) {
                d3.select(id).remove();
                return true;
            } else {
                return false;
            }
        }

        /**
         * Function to create a new svg graph instance based on the HTML element id or it's related object
         * @param id {string} Id of the HTML element or it's related object to create graph into (Ex: "#graph","#svg")
         * @returns {boolean} return if false if it's not ready the library
         * @private
         */
        function _initiateGraph(id) {
            if (d3) {
                return d3.select(id).append("svg");
            } else {
                return false;
            }
        }

        /**
         * Function to add a property to an element instance
         * @param element {object} The element to which add the property
         * @param prop {string/object} The property name, or a name value object containing multiple properties
         * @param value { number/string} The value property, not evaluated if first parameter is object
         * @returns {*} The element with the new property
         * @private
         */
        function _addAttribute(element, prop, value) {
            if (typeof prop != "object")
                return element.attr(prop, value);
            else
                return element.attr(prop);
        }

        /**
         * Function to add a new section to the graph
         * @param svg {object} The graph to which add the section
         * @param sectionName {string} The new section name
         * @returns {*} The created section
         * @private
         */
        function _addSection(svg, sectionName) {
            return svg.append("g").attr("id", sectionName);
        }

        /**
         * Function to append a new element to another
         * @param attachPoint {object} The element to which attack the new element
         * @param type {string} the type of the new element
         * @param attrsObject {object} The object name-value containing all the properties
         * @returns {*}
         * @private
         */
        function _addElement(attachPoint,type,attrsObject) {
            return attachPoint
                .append(type)
                .attrs(attrsObject);
        }

        /**
         * Function to add a new definition to a section
         * @param section {object} The section to which add the new definition
         * @param type {string} The base type of the new definition
         * @param attrsObject {object} The object name-value containing all the properties
         * @returns {*} The created definition
         * @private
         */
        function _addSimpleDefinition(section, type, attrsObject) {
            var def = section.append("defs");
            def.append(type)
                .attrs(attrsObject);
            return def;
        }

        /**
         * Function to add a new definition to a section with nested element
         * @param section {object} The section to which add the new definition
         * @param type {string} The base type of the new definition
         * @param attrsObject {object} The object name-value containing all the properties. If it contains children list of
         *          object the are nest into. From them is extrapolated the type
         * @private
         */
        function _addNestedDefinition(section, type, attrsObject) {
            var children = attrsObject.children;
            delete attrsObject.children;
            var def = section.append("defs")
                .append(type).attrs(attrsObject);
            if (children && children.length > 0)
                children.forEach(function (child) {
                    var type = child.type;
                    delete child.type;
                    _addNest(def, type, child)
                })
        }

        /**
         * Function to add a nested element
         * @param definition {object} The original element
         * @param type {string} The new element type
         * @param attrsObject {object} The object name-value containing all the properties. If it contains children list of
         *          object the are nest into. From them is extrapolated the type
         * @private
         */
        function _addNest(definition, type, attrsObject) {
            var children = attrsObject.children;
            delete attrsObject.children;
            var def = definition.append(type).attrs(attrsObject);
            if (children && children.length > 0)
                children.forEach(function (child) {
                    var type = child.type;
                    delete child.type;
                    _addNest(def, type, child)
                })
        }

        /**
         * Function to get a new drag behavior
         * @returns {*} Drag behavior to be customized
         * @private
         */
        function _addDragBehavior() {
            return d3.drag();
        }

        /**
         *
         * @param element
         * @returns {*}
         * @private
         */
        function _getTransform(element) {
            var transform = element.attr("transform");
            if (transform) {

                var translateStart = transform.indexOf("translate(");
                var translateEnd = transform.indexOf(")", translateStart);
                var translate = transform.substring(translateStart, translateEnd);
                var translateCoord = translate.substring(translateStart + "translate(".length, translateEnd).split(',');
                if (translateCoord.length != 2)
                    translateCoord = translateCoord[0].split(' ');
                /*
                 var scaleStart = transform.indexOf("scale(", translateEnd);
                 var scaleEnd = transform.indexOf(")", scaleStart);
                 var scale = transform.substring(scaleStart, scaleEnd);
                 var scaleValue = scale.substring(scaleStart + "scale(".length, scaleEnd);
                 */
                return d3.zoomIdentity.scale(/*Number(scaleValue)*/1).translate(Number(translateCoord[0]), Number(translateCoord[1]));
            }
            return d3.zoomIdentity;
        }

        /**
         *
         * @param element
         * @param transform
         * @returns {*}
         * @private
         */
        function _setTransform(element, transform) {
            return element.attr("transform", transform);
        }

        return {
            d3: _d3,
            initiateGraph: _initiateGraph,
            deleteGraph: _deleteGraph,
            addAttribute: _addAttribute,
            addSection: _addSection,
            addElement: _addElement,
            addSimpleDefinition: _addSimpleDefinition,
            addNestedDefinition: _addNestedDefinition,
            addDragBehavior: _addDragBehavior,
            getTransform: _getTransform,
            setTransform: _setTransform
        };
    };

    d3Service.$inject = [];

    angular.module('d3').service('d3Service', d3Service);
})();