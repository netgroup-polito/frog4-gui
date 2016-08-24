/**
 * Created by giacomo on 10/06/16.
 */
(function () {
    "use strict";
    /**
     * Service to add drag functionality to the graph element
     * @param graphConstant  The constant used in the graph directive as parameter
     * @param d3Service The service encapsulating part of the d3 library API
     * @returns {{dragEP: _dragEP, dragVNF: _dragVNF, dragPort: _dragPort, dragBS: _dragBS, dragBSInterface: _dragBSInterface}}
     */
    var fgDragService = function (graphConstant, d3Service) {
        /**
         * Drag functionality for the EP
         * @param getPosition Function to get the position element of the endpoint
         * @param callback Function called after updating the element, usually trigger the redraw
         * @returns {*} return a drag behavior to add to the element draw
         * @private
         */
        function _dragEP(getPosition, callback) {
            var drag = d3Service.addDragBehavior()
                .on("drag", function (d) {
                    //get the new x and y for the EP
                    var cx = parseInt(d3.event.x);
                    var cy = parseInt(d3.event.y);
                    // assign the new x and y
                    getPosition()[d.id].x = cx;
                    getPosition()[d.id].y = cy;
                    //calling the callback
                    callback();
                })
                .on("start", function () {
                    
                    d3.event.sourceEvent.stopPropagation();
                })
                .filter(function () {
                    return !d3.event.button;
                });
            return drag;
        }
        /**
         * Drag functionality for the VNF
         * @param getPosition Function to get the position element of the vnf
         * @param callback Function called after updating the element, usually trigger the redraw
         * @returns {*} return a drag behavior to add to the element draw
         * @private
         */
        function _dragVNF(getPosition, callback) {
            var drag = d3Service.addDragBehavior()
                .on("drag", function (d) {
                    //get the new x and y for the VNF
                    var x = parseInt(d3.event.x);
                    var y = parseInt(d3.event.y);
                    // assign the new x and y calculate from the center and normalized to origin of the rectangle
                    getPosition()[d.id].x = x - graphConstant.vnfWidth / 2;
                    getPosition()[d.id].y = y - graphConstant.vnfHeigth / 2;
                    //calling the callback
                    callback();
                })
                .on("start", function (d) {
                    
                    d3.event.sourceEvent.stopPropagation();
                })
                .filter(function () {
                    return !d3.event.button;
                });
            return drag;
        }

        /**
         * Drag functionality for the big-switch
         * @param getPosition Function to get the position element of the big-switch
         * @param callback Function called after updating the element, usually trigger the redraw
         * @returns {*} return a drag behavior to add to the element draw
         * @private
         */
        function _dragBS(getPosition, callback) {
            var drag = d3Service.addDragBehavior()
                .on("drag", function () {
                    //get the new x and y for the big-switch
                    var x = parseInt(d3.event.x);
                    var y = parseInt(d3.event.y);
                    // assign the new x and y calculate from the center and normalized to origin of the rectangle
                    getPosition().x = x - graphConstant.bigSwitchWidth / 2;
                    getPosition().y = y - graphConstant.bigSwitchHeight / 2;
                    //calling the callback
                    callback();
                })
                .on("start", function () {
                    
                    d3.event.sourceEvent.stopPropagation();
                })
                .filter(function () {
                    return !d3.event.button;
                });
            return drag;
        }

        /**
         * Drag functionality for the VNF interface
         * @param getPosition Function to get the position element of the vnf
         * @param callback Function called after updating the element, usually trigger the redraw
         * @returns {*} return a drag behavior to add to the element draw
         * @private
         */
        function _dragPort(getPosition, callback) {
            // variable used to calculate the type of movement
            var prevDragX = 0;
            var prevDragY = 0;
            var drag = d3Service.addDragBehavior()
                .on("start", function (d) {
                    
                    d3.event.sourceEvent.stopPropagation();
                    // at start of a drag reset the value to current position
                    prevDragX = d.x;
                    prevDragY = d.y;
                })
                .on("drag", function (d) {
                    // must stay on the border of the vnf
                    // the algorithm may be improved
                    // get the new x and y for the port
                    var x = parseInt(d3.event.x - getPosition()[d.parent].x);
                    var y = parseInt(d3.event.y - getPosition()[d.parent].y);
                    // if outside boundary reset to nearest side
                    if (x < 0)
                        x = 0;
                    if (x > graphConstant.vnfWidth)
                        x = graphConstant.vnfWidth;
                    if (y < 0)
                        y = 0;
                    if (y > graphConstant.vnfHeigth)
                        y = graphConstant.vnfHeigth;
                    // calculate the delta movement
                    var deltaX = Math.abs(prevDragX - x);
                    var deltaY = Math.abs(prevDragY - y);
                    // updating previous value
                    prevDragX = x;
                    prevDragY = y;

                    if (deltaX > deltaY) { // if moving more along the x
                        if (y > graphConstant.vnfHeigth / 2) { // check if y is above the half
                            y = graphConstant.vnfHeigth;
                        } else { // if moving more along the y
                            y = 0;
                        }
                    } else {
                        if (x > graphConstant.vnfWidth / 2) {// check if x is above the half
                            x = graphConstant.vnfWidth;
                        } else {
                            x = 0;
                        }
                    }
                    // updating position
                    getPosition()[d.parent].ports[d.port.id].x = x;
                    getPosition()[d.parent].ports[d.port.id].y = y;
                    //calling the callback
                    callback();
                })
                .filter(function () {
                    return !d3.event.button;
                });
            return drag;
        }

        /**
         * Drag functionality for the interface of the big-switch
         * @param getPosition Function to get the position element of the big-switch
         * @param callback Function called after updating the element, usually trigger the redraw
         * @returns {*} return a drag behavior to add to the element draw
         * @private
         */
        function _dragBSInterface(getPosition, callback) {
            // variable used to calculate the type of movement
            var prevDragX = 0;
            var prevDragY = 0;
            var drag = d3Service.addDragBehavior()
                .on("start", function (d) {
                    
                    d3.event.sourceEvent.stopPropagation();
                    // at start of a drag reset the value to current position

                    prevDragX = d.x;
                    prevDragY = d.y;
                })
                .on("drag", function (d) {
                    // must stay on the border of the big-switch
                    // the algorithm may be improved
                    // get the new x and y for the interface
                    var x = parseInt(d3.event.x /*- getPosition().x*/);
                    var y = parseInt(d3.event.y /*- getPosition().y*/);
                    // if outside boundary reset to nearest side
                    if (x < 0)
                        x = 0;
                    if (x > graphConstant.bigSwitchWidth)
                        x = graphConstant.bigSwitchWidth;
                    if (y < 0)
                        y = 0;
                    if (y > graphConstant.bigSwitchHeight)
                        y = graphConstant.bigSwitchHeight;
                    // calculate the delta movement
                    var deltaX = Math.abs(prevDragX - x);
                    var deltaY = Math.abs(prevDragY - y);
                    // updating previous value
                    prevDragX = x;
                    prevDragY = y;

                    if (deltaX > deltaY) {//if moving more along the x
                        if (y > graphConstant.bigSwitchHeight / 2) {// check if y is above the half
                            y = graphConstant.bigSwitchHeight;
                        } else {
                            y = 0;
                        }
                    } else { // if moving more along the y
                        if (x > graphConstant.bigSwitchWidth / 2) {// check if x is above the half
                            x = graphConstant.bigSwitchWidth;
                        } else {
                            x = 0;
                        }
                    }
                    // updating position
                    getPosition().interfaces[d.full_id].x = x;
                    getPosition().interfaces[d.full_id].y = y;
                    //calling the callback
                    callback();
                })
                .filter(function () {
                    return !d3.event.button;
                });
            return drag;
        }

        return {
            dragEP: _dragEP,
            dragVNF: _dragVNF,
            dragPort: _dragPort,
            dragBS: _dragBS,
            dragBSInterface: _dragBSInterface
        }

    };
    fgDragService.$inject = ['graphConstant', 'd3Service'];

    angular.module('d3').service('fgDragService', fgDragService);
})();