/**
 * Created by giacomo on 10/06/16.
 */
(function () {
    "use strict";
    var fgDragService = function (graphConstant, d3Service) {

        var _dragEP = function (getPosition, callback) {
            return d3Service.addDragBehavior()
                .on("drag", function (d) {

                    var cx = parseInt(d3.event.x);
                    var cy = parseInt(d3.event.y);

                    getPosition()[d.id].x = cx;
                    getPosition()[d.id].y = cy;

                    callback();
                }).on("dragstart", function () {
                    d3.event.sourceEvent.stopPropagation();
                });
        };

        var _dragVNF = function (getPosition, callback) {
            return d3Service.addDragBehavior()
                .on("drag", function (d) {

                    var x = parseInt(d3.event.x);
                    var y = parseInt(d3.event.y);

                    getPosition()[d.id].x = x - graphConstant.vnfWidth / 2;
                    getPosition()[d.id].y = y - graphConstant.vnfHeigth / 2;

                    callback();
                }).on("dragstart", function (d) {
                    d3.event.sourceEvent.stopPropagation();
                });
        };

        var _dragBS = function (getPosition, callback) {
            return d3Service.addDragBehavior()
                .on("drag", function (d) {

                    var x = parseInt(d3.event.x);
                    var y = parseInt(d3.event.y);

                    getPosition().x = x - graphConstant.bigSwitchWidth / 2;
                    getPosition().y = y - graphConstant.bigSwitchHeight / 2;

                    callback();
                }).on("dragstart", function () {
                    d3.event.sourceEvent.stopPropagation();
                });
        };

        var _dragInterface = function (getPosition, callback) {
            var prevDragX = 0;
            var prevDragY = 0;
            return d3Service.addDragBehavior()
                .on("dragstart", function (d) {
                    d3.event.sourceEvent.stopPropagation();
                    prevDragX = d.x;
                    prevDragY = d.y;
                })
                .on("drag", function (d) {

                    var x = parseInt(d3.event.x - getPosition()[d.parent].x);
                    var y = parseInt(d3.event.y - getPosition()[d.parent].y);
                    if (x < 0)
                        x = 0;
                    if (x > graphConstant.vnfWidth)
                        x = graphConstant.vnfWidth;
                    if (y < 0)
                        y = 0;
                    if (y > graphConstant.vnfHeigth)
                        y = graphConstant.vnfHeigth;

                    var deltaX = Math.abs(prevDragX - x);
                    var deltaY = Math.abs(prevDragY - y);
                    prevDragX = x;
                    prevDragY = y;

                    if (deltaX > deltaY) {
                        if (y > graphConstant.vnfHeigth / 2) {
                            y = graphConstant.vnfHeigth;
                        } else {
                            y = 0;
                        }
                    } else {
                        if (x > graphConstant.vnfWidth / 2) {
                            x = graphConstant.vnfWidth;
                        } else {
                            x = 0;
                        }
                    }

                    getPosition()[d.parent].ports[d.port.id].x = x;
                    getPosition()[d.parent].ports[d.port.id].y = y;

                    callback();
                });
        };


        var _dragBSInterface = function (getPosition, callback) {
            var prevDragX = 0;
            var prevDragY = 0;
            return d3Service.addDragBehavior()
                .on("dragstart", function (d) {
                    d3.event.sourceEvent.stopPropagation();
                    prevDragX = d.x;
                    prevDragY = d.y;
                })
                .on("drag", function (d) {

                    var x = parseInt(d3.event.x - getPosition().x);
                    var y = parseInt(d3.event.y - getPosition().y);
                    if (x < 0)
                        x = 0;
                    if (x > graphConstant.bigSwitchWidth)
                        x = graphConstant.bigSwitchWidth;
                    if (y < 0)
                        y = 0;
                    if (y > graphConstant.bigSwitchHeight)
                        y = graphConstant.bigSwitchHeight;

                    var deltaX = Math.abs(prevDragX - x);
                    var deltaY = Math.abs(prevDragY - y);
                    prevDragX = x;
                    prevDragY = y;

                    if (deltaX > deltaY) {
                        if (y > graphConstant.bigSwitchHeight / 2) {
                            y = graphConstant.bigSwitchHeight;
                        } else {
                            y = 0;
                        }
                    } else {
                        if (x > graphConstant.bigSwitchWidth / 2) {
                            x = graphConstant.bigSwitchWidth;
                        } else {
                            x = 0;
                        }
                    }

                    getPosition().interfaces[d.id].x = x;
                    getPosition().interfaces[d.id].y = y;

                    callback();
                });
        };

        return {
            dragEP: _dragEP,
            dragVNF: _dragVNF,
            dragInterface: _dragInterface,
            dragBS: _dragBS,
            dragBSInterface: _dragBSInterface
        }

    };
    fgDragService.$inject = ['graphConstant', 'd3Service'];

    angular.module('d3').service('fgDragService', fgDragService);
})();