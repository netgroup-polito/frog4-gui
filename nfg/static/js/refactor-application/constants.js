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
        },
        imgUploadStatus: {
            IN_PROGRESS: 'IP',
            COMPLETED: 'CO',
            REMOTE: 'RE'
        }
    };

    angular.module("fg-gui").constant("AppConstant", appConstant)
})();
