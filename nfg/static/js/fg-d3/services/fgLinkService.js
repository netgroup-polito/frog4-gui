/**
 * Created by giacomo on 09/08/16.
 */
(function () {
    "use strict";
    /**
     *
     * @param $rootScope
     * @param forwardingGraphConstant
     * @param d3Service
     * @returns {{linkEP: _linkEP, linkVNFPort: _linkVNFPort, linkBSInterface: _linkBSInterface}}
     */
    var fgLinkService = function ($rootScope, forwardingGraphConstant, d3Service) {

        //variabili per il linking

        //link solo unidirezionali

        var firstElem = null;
        var secondElem = null;
        var tempLink = null;

        function drawTempLink(startPoint, connectionSection, svg) {
            var x = startPoint.x;
            var y = startPoint.y;
            tempLink = connectionSection
                .append("line")
                .attr("class", "tempLink line")
                .style("stroke-dasharray", ("3,3"))// class normalView is used to identify the element displayed only in standard view
                .attr("x1", x /* start coord x*/)
                .attr("y1", y /* start coord y*/)
                .attr("x2", x /* end coord x*/)
                .attr("y2", y /* end coord y*/);
            svg.on("mousemove", function () {
                var coordinates = d3.mouse(this);
                var x = coordinates[0];
                var y = coordinates[1];
                tempLink
                    .attr("x2", x /* end coord x*/)
                    .attr("y2", y /* end coord y*/);
            });
        }

        function closeTempLink(svg) {
            svg.on("mousemove", null);
            if (tempLink) {
                tempLink.remove();
                tempLink = null;
            }
        }

        function link(scope, connectionSection, svg) {
            $rootScope.$on(
                "linkCreationChanged",
                function (event, linking) {
                    if (!linking) {
                        if (firstElem) {
                            firstElem = null;
                            closeTempLink(svg);
                        }
                    }
                });
            return function (elem) {
                if (scope.isLinkCreation) {
                    if (firstElem == null) {
                        
                        firstElem = elem;
                        drawTempLink(firstElem, connectionSection, svg);
                    } else {
                        if (firstElem.full_id != elem.full_id) {
                            closeTempLink(svg);
                            secondElem = elem;
                            scope.onLinkCreation(firstElem, secondElem);
                            firstElem = null;
                            secondElem = null;
                        }
                    }
                } else {
                    if (firstElem)
                        firstElem = null;
                }
            }
        }


        function _linkEP(scope, connectionSection, svg) {
            return link(scope, connectionSection, svg);
        }

        function _linkVNFPort(scope, connectionSection, svg) {
            return link(scope, connectionSection, svg);
        }

        function _linkBSInterface(scope, connectionSection, svg) {
            return link(scope, connectionSection, svg);
        }

        return {
            linkEP: _linkEP,
            linkVNFPort: _linkVNFPort,
            linkBSInterface: _linkBSInterface
        }

    };
    fgLinkService.$inject = ['$rootScope', 'forwardingGraphConstant', 'd3Service'];

    angular.module('d3').service('fgLinkService', fgLinkService);
})
();