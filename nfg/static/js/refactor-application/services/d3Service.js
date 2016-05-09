/**
 * Created by giacomo on 06/05/16.
 */
(function () {
    var d3Service = function ($document, $q, $rootScope) {
        var d = $q.defer();

        var d3 = null;
        var svg = null;

        function onScriptLoad() {
            // Load client in the browser
            $rootScope.$apply(function () {
                d.resolve(window.d3);
            });
        }

        // Create a script tag with d3 as the source
        // and call our onScriptLoad callback when it
        // has been loaded
        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = 'static/js/libs/d3/d3.v3.min.js';
        scriptTag.onreadystatechange = function () {
            if (this.readyState == 'complete') onScriptLoad();
        };
        scriptTag.onload = onScriptLoad;

        var s = $document[0].getElementsByTagName('body')[0];
        s.appendChild(scriptTag);

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

        var _intiateGraph = function (id) {
            if (d3) {
                svg = d3.select(id).append("svg");
                return svg;
            }
        };


        return {
            d3: _d3,

            deleteGraph: _deleteGraph
        };
    };

    d3Service.$inject = ['$document', '$q', '$rootScope'];

    angular.module('fg-gui').service('d3Service', d3Service);
})();