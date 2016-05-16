/**
 * Created by giacomo on 16/05/16.
 */
(function () {
    var InitializationService = function () {

        var _initEPsPos = function (EP_list, svg) {
            var EP_Pos = {};
            var n = EP_list.length;
            var alfa = 2 * Math.PI / n;
            for (var i = 0; i < n; i++) {
                var ep = {};
                ep.x = parseInt(250 * Math.cos(alfa * (i)) + svg.node().getBoundingClientRect().width / 2);
                ep.y = parseInt(250 * Math.sin(alfa * (i)) + svg.node().getBoundingClientRect().height / 2);
                ep.ref = "end-point";
                ep.fullId = "endpoint:" + EP_list[i].id;
                ep.isLinked = false;
                EP_Pos[EP_list[i].id] = ep;
            }
            return EP_Pos;
        };

        return {
            initEPsPos: _initEPsPos
        };
    };

    angular.module("fg-gui").service("InitializationService", InitializationService);
})();


