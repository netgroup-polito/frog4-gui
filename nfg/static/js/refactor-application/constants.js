/**
 * Created by giacomo on 12/05/16.
 */
(function () {
    "use strict";

    var appConstant = {
        graphOrigin: {
            LOCAL: 'local',
            UN: 'un',
            REPOSITORY: 'repo'
        }
    };

    angular.module("fg-gui").constant("AppConstant", appConstant)
})();