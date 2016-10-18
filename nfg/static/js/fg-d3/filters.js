/**
 * Created by giacomo on 16/07/16.
 */
(function () {
    "use strict";
    //here will go angular filter
    var vnfCompName = function () {
        return function (input, description) {

            if (typeof(description) == 'undefined') {
                return input;
            }
            var text = description.text;
            var split = text.split(",");
            for (var i = 0; i < split.length; i++) {

                if (split[i].indexOf('name=') != -1) {
                    var split2 = split[i].split("=");
                    return split2[1].replace(/[']/g, "");
                }
            }
            return input;
        }
    };
    angular.module("d3").filter("vnfCompName", vnfCompName);
})();